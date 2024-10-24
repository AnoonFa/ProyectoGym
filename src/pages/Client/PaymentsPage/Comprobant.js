import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../../../components/Header/Header';
import Relleno from '../../../components/Relleno/Relleno';

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
`;

const Title = styled.h1`
  font-size: 1.5em;
  color: #003366;
`;

const Subtitle = styled.h2`
  font-size: 1.2em;
  color: #d9534f;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
`;

const Button = styled.button`
  background-color: #d9534f;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  margin-top: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const TableCell = styled.td`
  border: 1px solid #ccc;
  padding: 10px;
`;

const Comprobant = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <Container>
      <Header />
      <Relleno/>
      <Title>GIMNASIO David & Goliat</Title>
      <Subtitle>Comprobante de Pago</Subtitle>
      <FormGroup>
        <Label>Fecha de Pago:</Label>
        <Input type="text" value={new Date().toLocaleDateString()} readOnly />
      </FormGroup>
      <FormGroup>
        <Label>Nombre:</Label>
        <Input type="text" value={state?.name || ''} readOnly />
      </FormGroup>
      <FormGroup>
        <Label>Teléfono:</Label>
        <Input type="text" value={state?.phone || ''} readOnly />
      </FormGroup>
      <FormGroup>
        <Label>Plan:</Label>
        <Input type="text" value={state?.plan || ''} readOnly />
      </FormGroup>
      <FormGroup>
        <Label>Costo:</Label>
        <Input type="text" value={state?.cost || ''} readOnly />
      </FormGroup>
      <FormGroup>
        <Label>Método de Pago:</Label>
        <Input type="text" value={state?.paymentMethod || ''} readOnly />
      </FormGroup>
      <FormGroup>
        <Label>Empleado:</Label>
        <Input type="text" value="Nombre del Empleado" readOnly />
      </FormGroup>
      <Table>
        <thead>
          <tr>
            <TableCell>Costo final</TableCell>
            <TableCell>Dinero Recibido</TableCell>
            <TableCell>Total</TableCell>
          </tr>
        </thead>
        <tbody>
          <tr>
            <TableCell>{state?.cost || ''}</TableCell>
            <TableCell>{state?.cost || ''}</TableCell>
            <TableCell>{state?.cost || ''}</TableCell>
          </tr>
        </tbody>
      </Table>
      <Button onClick={handleBack}>Volver</Button>
    </Container>
  );
};

export default Comprobant;
