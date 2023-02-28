import React from 'react';
import { Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Weight } from '../types';
import WeightRecord from '../components/WeightRecord';

type DashboarViewProps = {
  weights: Weight[];
  onLogout: () => void;
  onAdd: () => void;
  onEdit: (weight: Weight) => void;
};

const DashboardView: React.FC<DashboarViewProps> = ({ weights, onAdd, onLogout, onEdit }) => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full gap-4 px-4">
      <div className="flex flex-row w-full h-10 justify-between items-center">
        <Button onClick={onLogout}>Log Out</Button>
        <Button onClick={onAdd}>Add Weight</Button>
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Weight&nbsp; (kg)</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {weights.map((weight, i) => (
            <WeightRecord key={weight.name} label={i + 1} weight={weight} onEdit={onEdit} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DashboardView;
