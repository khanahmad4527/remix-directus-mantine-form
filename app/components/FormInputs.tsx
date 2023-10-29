import * as Yup from "yup";
import {
  Anchor,
  Box,
  Button,
  Checkbox,
  NativeSelect,
  PasswordInput,
  Popover,
  Progress,
  Text,
  TextInput,
  rem,
} from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { useField, useIsSubmitting } from "remix-validated-form";

type FormInputWrapperProps = {
  name: string;
  label?: string;
  placeholder?: string;
  nativeSelectData?: string[];
  withAsterisk?: boolean;
};

export const FormInputWrapper = ({
  name,
  label,
  placeholder,
  withAsterisk = false,
}: FormInputWrapperProps) => {
  const { error, getInputProps } = useField(name);

  return (
    <TextInput
      withAsterisk={withAsterisk}
      error={error}
      label={label}
      placeholder={placeholder}
      {...getInputProps({ id: name })}
    />
  );
};

export const FormPasswordWrapper = ({
  name,
  label,
  placeholder,
  withAsterisk = false,
}: FormInputWrapperProps) => {
  const { error, getInputProps } = useField(name);

  return (
    <PasswordInput
      withAsterisk={withAsterisk}
      error={error}
      label={label}
      placeholder={placeholder}
      {...getInputProps({ id: name })}
    />
  );
};

export const FormStrongPasswordWrapper = ({
  name,
  label,
  placeholder,
  withAsterisk = false,
}: FormInputWrapperProps) => {
  function PasswordRequirement({
    meets,
    label,
  }: {
    meets: boolean;
    label: string;
  }) {
    return (
      <Text
        c={meets ? "teal" : "red"}
        style={{ display: "flex", alignItems: "center" }}
        mt={7}
        size="sm"
      >
        {meets ? (
          <IconCheck style={{ width: rem(14), height: rem(14) }} />
        ) : (
          <IconX style={{ width: rem(14), height: rem(14) }} />
        )}{" "}
        <Box ml={10}>{label}</Box>
      </Text>
    );
  }

  const requirements = [
    { re: /[0-9]/, label: "Includes number" },
    { re: /[a-z]/, label: "Includes lowercase letter" },
    { re: /[A-Z]/, label: "Includes uppercase letter" },
    { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: "Includes special symbol" },
  ];

  function getStrength(password: string) {
    let multiplier = password.length > 7 ? 0 : 1;

    requirements.forEach((requirement) => {
      if (!requirement.re.test(password)) {
        multiplier += 1;
      }
    });

    return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
  }

  const [popoverOpened, setPopoverOpened] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");

  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement
      key={index}
      label={requirement.label}
      meets={requirement.re.test(value)}
    />
  ));

  const strength = getStrength(value);
  const color = strength === 100 ? "teal" : strength > 50 ? "yellow" : "red";

  const { error, getInputProps } = useField(name);

  return (
    <Popover
      opened={popoverOpened}
      position="bottom"
      width="target"
      transitionProps={{ transition: "pop" }}
    >
      <Popover.Target>
        <Box
          onFocusCapture={() => setPopoverOpened(true)}
          onBlurCapture={() => setPopoverOpened(false)}
        >
          <PasswordInput
            withAsterisk={withAsterisk}
            placeholder={placeholder}
            value={value}
            onInput={(event) => setValue(event.currentTarget.value)}
            error={error}
            label={label}
            {...getInputProps({ id: name })}
          />
        </Box>
      </Popover.Target>
      <Popover.Dropdown>
        <Progress color={color} value={strength} size={5} mb="xs" />
        <PasswordRequirement
          label="Includes at least 8 characters"
          meets={value.length > 7}
        />
        {checks}
      </Popover.Dropdown>
    </Popover>
  );
};

export const FormCheckboxWrapper = ({ name }: FormInputWrapperProps) => {
  const { error, getInputProps } = useField(name);
  return (
    <Checkbox
      label={
        <>
          I accept{" "}
          <Anchor href="https://mantine.dev" target="_blank" inherit>
            terms and conditions
          </Anchor>
        </>
      }
      error={error}
      {...getInputProps({ id: name })}
    />
  );
};

export const FormNativeSelectWrapper = ({
  name,
  label,
  placeholder,
  nativeSelectData,
  withAsterisk = false,
}: FormInputWrapperProps) => {
  const { error, getInputProps } = useField(name);

  return (
    <NativeSelect
      withAsterisk={withAsterisk}
      error={error}
      label={label}
      data={nativeSelectData}
      placeholder={placeholder}
      {...getInputProps({ id: name })}
    />
  );
};

export const FormSubmitButton = ({ label }: { label: string }) => {
  const isSubmitting = useIsSubmitting();

  return (
    <Button type="submit" loading={isSubmitting} loaderProps={{ type: "dots" }}>
      {label}
    </Button>
  );
};

export const validationFields = {
  first_name: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .max(50)
    .matches(/^[a-zA-Z\s]+$/, "First name must contain only alphabets")
    .required("First name is required"),

  last_name: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .max(50)
    .matches(/^[a-zA-Z\s]+$/, "Last name must contain only alphabets")
    .required("Last name is required"),

  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .max(128)
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$&+,:;=?@#|<>.^*()%!-])/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .required("Password is required"),

  confirm_password: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),

  terms: Yup.string()
    .oneOf(["on"], "You must accept the terms and conditions")
    .required("You must accept the terms and conditions"),
};
