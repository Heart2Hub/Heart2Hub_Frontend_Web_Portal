import React from "react";
import { Checkbox } from "@mui/material";
import { useField } from "formik";

function CheckboxWrapper({ name, ...otherProps }) {
  const [field, meta] = useField(name);

  const configCheckbox = {
    ...field,
    ...otherProps,
  };

  if (meta && meta.touched && meta.error) {
    configCheckbox.error = true;
    configCheckbox.helperText = meta.error;
  }

  return <Checkbox {...configCheckbox} checked={field.value} />;
}

export default CheckboxWrapper;
