import { Weight } from './types';

type StoreOptions = {
  url: string;
  token?: string;
};

type RequestOptions = {
  method?: string;
  values?: Record<string, any>;
  path: string;
};

export class Store {
  private token?: string;

  constructor(private readonly options: StoreOptions) {
    if (options.token) {
      this.token = options.token;
    }
  }

  public logout() {
    console.log('Clearing token...')
    localStorage.removeItem('token')
  }

  public async login(email: string, password: string): Promise<{ token: string }> {
    const body = await this.request({ path: '/login', values: { email, password } });

    this.token = body['token'];

    if (!this.token) {
      throw new Error(`Unexpected body: ${body}`);
    }

    localStorage.setItem('token', this.token);

    return { token: this.token };
  }

  public async signup(email: string, password: string): Promise<{ token: string }> {
    const body = await this.request({ path: '/signup', values: { email, password } });

    this.token = body['token'];

    if (!this.token) {
      throw new Error(`Unexpected body: ${body}`);
    }

    localStorage.setItem('token', this.token);

    return { token: this.token };
  }

  public async addWeight(name: string, weight: number): Promise<void> {
    const body = await this.request({ path: '/save_weight', values: { name, weight } });
    if (body['message'] !== 'success') {
      throw new Error(`Unexpected body: '${body}'`);
    }
    return;
  }

  public async updateWeight(name: string, weight: number): Promise<void> {
    const body = await this.request({ path: '/update_weight', values: { name, weight } });
    if (body['message'] !== 'success') {
      throw new Error(`Unexpected body: '${body}'`);
    }
    return;
  }

  public async deleteWeight(name: string): Promise<void> {
    const body = await this.request({ path: '/delete_weight', values: { name } });
    if (body['message'] !== 'success') {
      throw new Error(`Unexpected body: '${body}'`);
    }
    return;
  }

  public async getWeights(): Promise<Weight[]> {
    const body = await this.request({ path: '/get_weight_history', method: 'GET' });
    
    const weights = body['weights'] as Weight[]
    
    return weights.sort((a, b) => a.createdAt < b.createdAt ? 1 : -1)
  }

  private async request({ path, values, method = 'POST' }: RequestOptions): Promise<any> {    
    const reqInit: RequestInit = { method };

    if (this.token) {
      reqInit.headers = { ...reqInit.headers, Authorization: `Bearer ${this.token}` };
    }

    if (values) {
      reqInit.headers = { ...reqInit.headers, 'Content-Type': 'application/json' };
      reqInit.body = JSON.stringify(values);
    }

    const url = `${this.options.url}${path}`;

    console.log(`Making '${method}' request to ${url}`);

    const res = await fetch(url, reqInit);

    const body = await res.text();

    if (res.status !== 200) {
      throw new Error(`Unexpected status code '${res.status}' with body: ${body}`);
    }

    const parsed = JSON.parse(body);
    return parsed;
  }
}
