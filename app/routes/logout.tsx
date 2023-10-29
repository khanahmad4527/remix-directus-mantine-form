import { logout } from "@directus/sdk";
import { type LoaderFunctionArgs } from "@remix-run/node";
import { directus } from "~/auth";

export async function loader({ request }: LoaderFunctionArgs) {
  //   get refresh_token that you have stored and passed it into logout

  const getRefreshToken = () => {
    return "123";
  };

  const refresh_token = getRefreshToken();

  // destroy the session you may have created

  await directus.request(logout(refresh_token));
}
