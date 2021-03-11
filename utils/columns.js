import React from "react";
import {
  Cancel as CancelIcon,
  CheckCircle as CheckIcon,
} from "@material-ui/icons";
import { green } from "@material-ui/core/colors";

const labelGenerator = (col, columnsCustom) => {
  let custom_option = columnsCustom.filter((op) => op.name === col);
  if (custom_option.length !== 0 && custom_option[0].label) {
    return custom_option[0].label;
  } else {
    return (col.charAt(0).toUpperCase() + col.slice(1)).split("_").join(" ");
  }
};

const filterSetter = (col, columnsCustom) => {
  let custom_option = columnsCustom.filter((op) => op.name === col);
  if (custom_option.length !== 0 && custom_option[0].filter) {
    return custom_option[0].filter;
  } else {
    return false;
  }
};

const filterTypeSetter = (col, columnsCustom) => {
  let custom_option = columnsCustom.filter((op) => op.name === col);
  if (custom_option.length !== 0 && custom_option[0].filterType) {
    return custom_option[0].filterType;
  } else {
    return "dropdown";
  }
};

const filterOptionSetter = (col, columnsCustom) => {
  let custom_option = columnsCustom.filter((op) => op.name === col);
  if (custom_option.length !== 0 && custom_option[0].filterOptions) {
    return custom_option[0].filterOptions;
  } else {
    return [];
  }
};

const sortSetter = (col, columnsCustom) => {
  let custom_option = columnsCustom.filter((op) => op.name === col);
  if (custom_option.length !== 0 && custom_option[0].sort) {
    return custom_option[0].sort;
  } else {
    return false;
  }
};

const displaySetter = (col, columnsCustom) => {
  let custom_option = columnsCustom.filter((op) => op.name === col);
  if (
    custom_option.length !== 0 &&
    Object.keys(custom_option[0]).filter((key) => key === "display").length !==
      0
  ) {
    return custom_option[0].display;
  } else {
    return true;
  }
};

export function generate_columns(data, columnsCustom) {
  let column_array = [];
  let column_names = [];

  data.map((row) => {
    column_names = Object.keys(row);
    column_array = column_names.map((col) => {
      return {
        label: labelGenerator(col, columnsCustom),
        name: col,
        options: {
          filter: filterSetter(col, columnsCustom),
          filterType: filterTypeSetter(col, columnsCustom),
          filterOptions: filterOptionSetter(col, columnsCustom),
          sort: sortSetter(col, columnsCustom),
          display: displaySetter(col, columnsCustom),
          customBodyRender: (value, tableMeta, updateValue) => {
            if (value === null) {
              return "N/A";
            } else {
              let custom_option = columnsCustom.filter((op) => op.name === col);
              if (custom_option.length === 0) {
                if (typeof value === "object") {
                  return value.id;
                } else if (typeof value === "boolean") {
                  if (value) {
                    return <CheckIcon style={{ color: green[500] }} />;
                  } else {
                    return <CancelIcon color="secondary" />;
                  }
                } else {
                  return value;
                }
              } else {
                if (custom_option[0].comp) {
                  return custom_option[0].comp(value, tableMeta, updateValue);
                } else {
                  if (custom_option[0].value) {
                    return value[custom_option[0].value];
                  } else {
                    return value;
                  }
                }
              }
            }
          },
        },
      };
    });
  });

  let new_custom_column = columnsCustom.filter(
    (op) => op.name === "new_column_array"
  );

  let new_colum = [];
  if (new_custom_column[0].new) {
    new_colum = new_custom_column[0].new.map((col) => {
      return {
        label: col.label,
        name: col.name,
        options: {
          filter: col.filter ? col.filter : false,
          sort: col.sort ? col.sort : false,
          customBodyRender: (value, tableMeta, updateValue) => {
            if (value === null) {
              return "N/A";
            } else {
              if (col.comp) {
                return col.comp(value, tableMeta, updateValue);
              } else {
                if (col.value) {
                  return value[col.value];
                } else {
                  return value;
                }
              }
            }
          },
        },
      };
    });
  }

  return [...column_array, ...new_colum];
}
