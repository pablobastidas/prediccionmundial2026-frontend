import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export const OTPForm: React.FC<{ email: string; onSubmit: (otp: string) => void }> = ({ email, onSubmit }) => {
  const [otp, setOtp] = useState('');

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(otp); }}>
      <p className="text-sm text-gray-600 mb-4">Hemos enviado un código a <strong>{email}</strong></p>
      <Input 
        type="text" 
        label="Código de Seguridad" 
        value={otp} 
        onChange={(e) => setOtp(e.target.value)} 
        required 
        placeholder="123456"
      />
      <Button type="submit" className="w-full">Verificar</Button>
    </form>
  );
};
