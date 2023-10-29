import * as Yup from "yup";
import { ValidatedForm, validationError } from "remix-validated-form";
import { withYup } from "@remix-validated-form/with-yup";
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
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import {
  FormCheckboxWrapper,
  FormInputWrapper,
  FormPasswordWrapper,
  FormStrongPasswordWrapper,
  FormSubmitButton,
  validationFields,
} from "~/components/FormInputs";
import axios from "axios";

const registerValidator = withYup(
  Yup.object({
    first_name: validationFields.first_name,
    last_name: validationFields.last_name,
    email: validationFields.email,
    password: validationFields.password,
    confirm_password: validationFields.confirm_password,
    terms: validationFields.terms,
  })
);

export async function loader({ request }: LoaderFunctionArgs) {
  // check if user is already login then redirect user to home page

  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const fieldValues = await registerValidator.validate(formData);
  if (fieldValues.error) return validationError(fieldValues.error);
  const { confirm_password, terms, ...userData } = fieldValues.data;

  try {
    await axios.post(`${process.env.YOUR_DIRECTUS_BASE_URL}/users`, userData);

    return redirect("/login");
  } catch (error: any) {
    if (error.response.data.errors[0].extensions.field === "email") {
      console.log("Email is already in use");
    } else if (error.response.data.errors[0].extensions.field === "password") {
      console.log("Password is not strong");
    }
  }

  return redirect("/");
}

export default function Register() {
  return (
    <Container size={520} my={50}>
      <Paper radius="md" p="xl" withBorder>
        <Text size="lg" fw={500}>
          Welcome to BossBuddy, register with
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

        <ValidatedForm validator={registerValidator} method="post">
          <Stack>
            <Group grow>
              <FormInputWrapper
                name="first_name"
                label="First name"
                placeholder="John Doe"
                withAsterisk
              />

              <FormInputWrapper
                name="last_name"
                label="Last name"
                placeholder="John Doe"
                withAsterisk
              />
            </Group>

            <FormInputWrapper
              name="email"
              label="Email"
              placeholder="john@example.com"
              withAsterisk
            />

            <FormStrongPasswordWrapper
              name="password"
              label="Password"
              placeholder="Your password"
              withAsterisk
            />

            <FormPasswordWrapper
              name="confirm_password"
              label="Confirm Password"
              placeholder="Your password"
              withAsterisk
            />

            <FormCheckboxWrapper name="terms" />
          </Stack>

          <Group justify="space-between" mt="xl">
            <Text size="sm">
              <Link to="/login">Already have an account? Login</Link>
            </Text>

            <FormSubmitButton label={"Register"} />
          </Group>
        </ValidatedForm>
      </Paper>
    </Container>
  );
}
