import * as Yup from "yup";
import { ValidatedForm, validationError } from "remix-validated-form";
import {
  Text,
  Paper,
  Group,
  Button,
  Divider,
  Stack,
  Container,
} from "@mantine/core";
import { Link } from "@remix-run/react";
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { type AuthenticationData } from "@directus/sdk";
import { withYup } from "@remix-validated-form/with-yup";
import {
  FormInputWrapper,
  FormPasswordWrapper,
  FormSubmitButton,
  validationFields,
} from "~/components/FormInputs";
import { directus } from "~/auth";

const loginValidator = withYup(
  Yup.object({
    email: validationFields.email,
    password: validationFields.password,
  })
);

export async function loader({ request }: LoaderFunctionArgs) {
  // check if user is already login then redirect user to home page

  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const fieldValues = await loginValidator.validate(formData);
  if (fieldValues.error) return validationError(fieldValues.error);
  const { email, password } = fieldValues.data;

  try {
    const { access_token, refresh_token }: AuthenticationData =
      await directus.login(email, password, { mode: "json" });

    //   use access_token and refresh_token store it in the session that you created

    return json({ access_token, refresh_token });
  } catch (error: any) {
    console.log(error);
  }

  return null;
}

export default function Login() {
  return (
    <Container size={520} my={50}>
      <Paper radius="md" p="xl" withBorder>
        <Text size="lg" fw={500}>
          Welcome to BossBuddy, login with
        </Text>

        <Group grow mb="md" mt="md">
          <Button>Google</Button>
          <Button>Facebook</Button>
        </Group>

        <Divider
          label="Or continue with email"
          labelPosition="center"
          my="lg"
        />

        <ValidatedForm validator={loginValidator} method="post">
          <Stack>
            <FormInputWrapper
              name="email"
              label="Email"
              placeholder="john@example.com"
              withAsterisk
            />

            <FormPasswordWrapper
              name="password"
              label="Password"
              placeholder="Your password"
              withAsterisk
            />
          </Stack>

          <Group justify="space-between" mt="xl">
            <Text size="sm">
              <Link to="/register">Don't have an account? Register</Link>
            </Text>

            <FormSubmitButton label={"Login"} />
          </Group>
        </ValidatedForm>
      </Paper>
    </Container>
  );
}
