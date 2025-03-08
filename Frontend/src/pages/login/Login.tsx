import Client from "@/api/Client";
import { Button } from "@/components/ui";
import {
  Form,
  FormControlInput,
  FormField,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { AuthActions } from "@/shared/enums";
import { useAuth } from "@/shared/hooks/auth/useAuth";
import Routes from "@/shared/utils/routes";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.scss";
import { getErrorMessage } from "@/shared/utils/helpers";
import { ILogin } from "@/shared/interfaces";

const Login = () => {
  const { dispatchUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (loginData: ILogin) => {
    try {
      const user = await Client.User.login(loginData);
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
          const loginData: ILogin = {
            nickname: event.currentTarget.nickname.value,
            password: event.currentTarget.password.value,
          };
          await handleLogin(loginData);
        }}
        className="w-[260px] space-y-4"
      >
        <FormField name="nicknameField">
          <FormLabel>Login</FormLabel>
          <FormControlInput type="text" placeholder="Wprowadź login" required name="nickname" />
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

        <div className={styles.ButtonsContainer}>
          <Button type="submit">Zaloguj się</Button>
          <Link to={Routes.Register}>Zarejestruj się</Link>
        </div>
      </Form>
    </main>
  );
};

export default Login;
