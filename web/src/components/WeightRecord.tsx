import { TableCell, TableRow } from '@mui/material';
import React, { useCallback } from 'react';
import { Weight } from '../types';

type WeightRecordProps = {
  label: number;
  weight: Weight;
  onEdit: (weight: Weight) => void;
};

const WeightRecord: React.FC<WeightRecordProps> = ({ label, weight, ...props }) => {
  const onEdit = useCallback(() => {
    props.onEdit(weight);
  }, []);

  return (
    <TableRow>
      <TableCell>{label}</TableCell>
      <TableCell>{weight.name}</TableCell>
      <TableCell>{weight.weight}</TableCell>
      <TableCell>{weight.createdAt}</TableCell>
      <TableCell className='hover:cursor-pointer' onClick={onEdit}>Edit</TableCell>
    </TableRow>
  );
};

export default WeightRecord;
