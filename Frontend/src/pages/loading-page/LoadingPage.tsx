import { AuthResponseElements } from "@/shared/AuthResponseElements";
import { LocalStorageElements } from "@/shared/LocalStorageElements";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TOKEN_LINK = import.meta.env.VITE_TOKEN_LINK;

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
          localStorage.setItem(
            LocalStorageElements.Token,
            responseData.Token || ""
          );
          localStorage.setItem(
            LocalStorageElements.FirstName,
            responseData.FirstName || ""
          );
          localStorage.setItem(
            LocalStorageElements.LastName,
            responseData.LastName || ""
          );
          console.log(responseData);
          navigate("/home");
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      console.log(responseObj);
      getData();
    }
  }, [navigate]);

  return <div>Oczekiwanie na pobranie danych</div>;
};

export default LoadingPage;
