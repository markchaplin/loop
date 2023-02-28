import React, { useCallback, useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { Weight } from '../types';
import { Store } from '../store';

type ManageViewProps = {
  store: Store;
  weight?: Weight;
  onBack: () => void;
};

type FormValues = {
  name: string;
  weight: number;
};

const ManageView: React.FC<ManageViewProps> = ({ onBack, weight, store }) => {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const { control, handleSubmit, formState, reset } = useForm<FormValues>({
    defaultValues: {
      name: weight?.name ?? '',
      weight: weight?.weight ?? 0,
    },
  });

  const onSubmit = useCallback(async (values: FormValues) => {
    setErrorMessage(undefined);
    try {
      setLoading(true);
      if (weight) {
        await store.updateWeight(values.name, values.weight);
      } else {
        await store.addWeight(values.name, values.weight);
      }

      setSuccessMessage(weight ? 'Weight updated successfully' : 'Weight added successfully');
      setLoading(false);
      setTimeout(() => {
        reset()
        onBack();
      }, 3000);
    } catch (e) {
      setErrorMessage((e as Error).message);
      setLoading(false);
    }
  }, []);

  const onDelete = useCallback(async () => {
    if (!weight) {
      return; // Only callable when weight is defined
    }
    setErrorMessage(undefined);
    try {
      setLoading(true);
      await store.deleteWeight(weight?.name);

      setSuccessMessage('Weight deleted successfully');
      setLoading(false);
      setTimeout(() => {
        reset()
        onBack();
      }, 3000);
    } catch (e) {
      setErrorMessage((e as Error).message);
      setLoading(false);
    }
  }, []);

  const disabled = loading || !!successMessage || !!errorMessage

  return (
    <form className="flex flex-col justify-between items-center h-full w-full" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col justify-center items-center w-full h-8">
        {successMessage && <Typography>{successMessage}</Typography>}
        {errorMessage && <Typography color="red">{errorMessage}</Typography>}
      </div>
      <Controller
        name="name"
        control={control}
        rules={{ required: 'Name is required' }}
        render={({ field }) => (
          <TextField id="outlined-basic" label="Name" variant="outlined" disabled={!!weight} {...field} />
        )}
      />
      <Typography color="error">{formState.errors.name?.message}</Typography>
      <Controller
        name="weight"
        control={control}
        rules={{ required: 'Weight is required' }}
        render={({ field }) => (
          <TextField id="outlined-basic" label="Weight" variant="outlined" type="number" {...field} />
        )}
      />
      <Typography color="error">{formState.errors.weight?.message}</Typography>
      <div className="flex flex-row w-full justify-between">
        <Button disabled={disabled} onClick={onBack}>
          Back
        </Button>
        {weight && (
          <Button disabled={disabled} onClick={onDelete}>
            Delete
          </Button>
        )}
        <Button disabled={disabled} type="submit">
          {weight ? 'Update' : 'Add'}
        </Button>
      </div>
    </form>
  );
};

export default ManageView;
