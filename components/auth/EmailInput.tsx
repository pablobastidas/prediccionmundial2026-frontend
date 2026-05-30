import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export const EmailInput: React.FC<{ onSubmit: (email: string) => void }> = ({ onSubmit }) => {
  const [email, setEmail] = useState('');

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(email); }}>
      <Input 
        type="email" 
        label="Tu Email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        required 
        placeholder="juan@ejemplo.com"
      />
      <Button type="submit" className="w-full">Siguiente</Button>
    </form>
  );
};
