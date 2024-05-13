import Loader from "@/components/loader/Loader";
import { AuthActions } from "@/shared/enums";
import { AuthResponseElements } from "@/shared/enums/AuthResponseElements";
import { useAuth } from "@/shared/hooks/auth/useAuth";
import { IUser } from "@/shared/interfaces";
import { TOKEN_LINK } from "@/shared/utils/constants";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface IResponseTypeLogin {
  key: string | null;
  oauth_token: string | null;
  oauth_verifier: string | null;
}

interface IResponseTokenParams {
  Token?: string;
  FirstName?: string;
  LastName?: string;
}

const LoadingPage = () => {
  const navigate = useNavigate();
  const { dispatchUser } = useAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    if (!urlParams.get(AuthResponseElements.Key)) {
      return;
    }

    const responseObj: IResponseTypeLogin = {
      key: urlParams.get(AuthResponseElements.Key),
      oauth_token: urlParams.get(AuthResponseElements.OauthToken),
      oauth_verifier: urlParams.get(AuthResponseElements.OuathVerifier),
    };

    if (responseObj) {
      const getData = async () => {
        try {
          const response = await axios.get<IResponseTokenParams>(
            `${TOKEN_LINK}?key=${responseObj.key}&oauth_token=${responseObj.oauth_token}&oauth_verifier=${responseObj.oauth_verifier}`
          );

          const responseData = response.data;
          const user: IUser = {
            token: responseData.Token || "",
            firstName: responseData.FirstName || "",
            lastName: responseData.LastName || "",
          };
          dispatchUser({ type: AuthActions.SetUser, payload: user });
          navigate("/home");
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      console.log(responseObj);
      getData();
    }
  }, [dispatchUser, navigate]);

  return <Loader isLoading isImmediate />;
};

export default LoadingPage;
