import React, { useCallback, useEffect, useState } from 'react';

import Layout from './components/Layout';
import HomeView from './views/Home';
import AuthView from './views/Auth';
import DashboardView from './views/Dashboard';
import ManageView from './views/Manage';
import { Weight } from './types';
import { Store } from './store';

type View = 'Home Page' | 'Log In' | 'Sign Up' | 'Your Weights' | 'Add Weight' | 'Edit Weight';

const App: React.FC = () => {
  const [view, setView] = useState<View>('Home Page');
  const [token, setToken] = useState<string>();
  const [selectedWeight, setSelectedWeight] = useState<Weight>();
  const [weights, setWeights] = useState<Weight[]>([]);
  const [store, setStore] = useState<Store>()
  
  useEffect(() => {
    const url = process.env.REACT_APP_API_URL;
    if (!url) {
      throw new Error(`API_URL env variable is required`);
    }

    const savedToken = localStorage.getItem('token')

    if (savedToken) {
      setToken(savedToken)
      setStore(new Store({ url, token: savedToken ?? undefined }));
      setView('Your Weights')
    } else {
      setStore(new Store({ url }));
    }
  }, [])


  useEffect(() => {
    loadWeights({ view, token });
  }, [view, token]);

  const loadWeights = useCallback(async (options: { view: View; token?: string }) => {
    if (!options.token || !store) {
      return;
    }

    const result = await store.getWeights();
    setWeights(result);
  }, [store]);

  const onLogin = useCallback(() => {
    setView('Log In');
  }, []);

  const onSignUp = useCallback(() => {
    setView('Sign Up');
  }, []);

  const onHome = useCallback(() => {
    if (!token) {
      setView('Home Page');
    } else {
      setView('Your Weights');
    }
    setSelectedWeight(undefined)
  }, [token]);

  const onLogout = useCallback(() => {
    setToken(undefined);
    store?.logout()
    setView('Home Page')
  }, [store]);

  const onLoggedIn = useCallback((token: string) => {
    setToken(token);
    setView('Your Weights');
  }, []);

  const onAdd = useCallback(() => {
    setView('Add Weight');
  }, []);

  const onEdit = useCallback((weight: Weight) => {
    setSelectedWeight(weight);
    setView('Edit Weight');
  }, []);

  return (
    <Layout title={view}>
      {view === 'Home Page' && <HomeView onLogin={onLogin} onSignin={onSignUp} />}
      {store && (view === 'Log In' || view === 'Sign Up') && (
        <AuthView store={store} onLoggedIn={onLoggedIn} onBack={onHome} existingUser={view === 'Log In'} />
      )}
      {view === 'Your Weights' && <DashboardView weights={weights} onLogout={onLogout} onAdd={onAdd} onEdit={onEdit} />}
      {store && (view === 'Add Weight' || view === 'Edit Weight') && (
        <ManageView store={store} weight={selectedWeight} onBack={onHome} />
      )}
    </Layout>
  );
};

export default App;
