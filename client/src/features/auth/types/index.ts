import { ChangeEvent } from 'react';
import {
  LoginCredentials,
  RegistrationCredentials,
} from '../../../utils/types/ui/pages.types';

export interface SignUpComponentsProps {
  onNext: () => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  userDetails: RegistrationCredentials;
  RegisterUser?: (userDetails: { email: string }) => void;
}
export interface PasswordEntryProps {
  handleFormInputs: (e: ChangeEvent<HTMLInputElement>) => void;
  password: string;
  setPasswordValid: (isvalid: boolean) => void;
}
export interface LoginFormProps {
  onSubmit: (data: LoginCredentials) => void;
  isLoading: boolean;
}
