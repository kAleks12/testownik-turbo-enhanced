import Client from "@/api/Client";
import { Button } from "@/components/ui";
import {
  Form,
  FormControlInput,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AuthActions } from "@/shared/enums";
import { useAuth } from "@/shared/hooks/auth/useAuth";
import { IRegister } from "@/shared/interfaces";
import Routes from "@/shared/utils/routes";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Register.module.scss";
import { getErrorMessage } from "@/shared/utils/helpers";

const Register = () => {
  const { dispatchUser } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (registerData: IRegister) => {
    try {
        const user = await Client.User.register(registerData);
        dispatchUser({ type: AuthActions.SetUser, payload: user });
        navigate(Routes.Home);
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        alert(errorMessage);
    }
  };

  return (
    <main className="w-full min-h-screen flex items-center justify-center">
      <Form
        onSubmit={async (event) => {
          event.preventDefault();
          const password = event.currentTarget.password.value;
          const passwordCheck = event.currentTarget.passwordCheck.value;

          if (password !== passwordCheck) {
            alert("Hasła nie są identyczne.");
            return;
          }

          const registerData: IRegister = {
            nickname: event.currentTarget.nickname.value,
            password: password,
            firstName: event.currentTarget.firstName.value,
            lastName: event.currentTarget.lastName.value,
          };
          await handleRegister(registerData);
        }}
        className="w-[260px] space-y-4"
      >
        <FormField name="nicknameField">
          <FormLabel>Login</FormLabel>
          <FormControlInput
            type="text"
            placeholder="Wprowadź login"
            required
            name="nickname"
          />
          <FormMessage match="valueMissing">To pole jest wymagane.</FormMessage>
        </FormField>

        <FormField name="firstNameField">
          <FormLabel>Imie</FormLabel>
          <FormControlInput
            type="text"
            placeholder="Wprowadź imie"
            required
            name="firstName"
          />
          <FormMessage match="valueMissing">To pole jest wymagane.</FormMessage>
        </FormField>

        <FormField name="lastNameField">
          <FormLabel>Nazwisko</FormLabel>
          <FormControlInput
            type="text"
            placeholder="Wprowadź nazwisko"
            required
            name="lastName"
          />
          <FormMessage match="valueMissing">To pole jest wymagane.</FormMessage>
        </FormField>

        <FormField name="passwordField">
          <FormLabel>Hasło</FormLabel>
          <FormControlInput
            placeholder="Wprowadź hasło"
            type="password"
            required
            name="password"
          />
          <FormMessage match="valueMissing">To pole jest wymagane.</FormMessage>
        </FormField>

        <FormField name="passwordCheckField">
          <FormLabel>Potwierdź hasło</FormLabel>
          <FormControlInput
            placeholder="Wprowadź hasło ponownie"
            type="password"
            required
            name="passwordCheck"
          />
          <FormMessage match="valueMissing">To pole jest wymagane.</FormMessage>
        </FormField>

        <div className={styles.ButtonsContainer}>
          <Button type="submit">Zarejestruj się</Button>
          <Link to={Routes.Login}>Zaloguj się</Link>
        </div>
      </Form>
    </main>
  );
};

export default Register;
