import React from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
import { useField, useFormikContext } from "formik";
import { ListSubheader } from "@mui/material";

const SelectWrapper = ({ name, options, ...otherProps }) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const handleChange = (evt) => {
    const { value } = evt.target;
    setFieldValue(name, value);
  };

  const configSelect = {
    ...field,
    ...otherProps,
    variant: "outlined",
    fullWidth: true,
    onChange: handleChange,
  };

  if (meta && meta.touched && meta.error) {
    configSelect.error = true;
    configSelect.helperText = meta.error;
  }
  console.log(options);

  return (
    <>
      <Select {...configSelect} sx={{ lineHeight: "2.5em" }}>
        {options.map((item) => {
          if (item === "Departments" || item === "Wards") {
            return <ListSubheader>{item}</ListSubheader>;
          } else {
            return (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            );
          }
        })}

        {/* <ListSubheader>Departments</ListSubheader> */}
      </Select>
      {meta && meta.touched && meta.error ? (
        <FormHelperText error>{meta.error}</FormHelperText>
      ) : null}
    </>
  );
};

export default SelectWrapper;
