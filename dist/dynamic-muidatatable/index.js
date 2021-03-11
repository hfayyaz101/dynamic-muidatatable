import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { generate_columns } from "./utils/columns";
import { useDispatch, useSelector } from "react-redux";
import { Paper, CircularProgress, makeStyles, Typography } from "@material-ui/core";
import { getListData } from "redux-axios-jwt"; // https://github.com/gregnb/mui-datatables/blob/master/examples/serverside-pagination/index.js

const useStyles = makeStyles(theme => ({
  progress: {
    marginLeft: theme.spacing(2),
    position: "relative",
    top: theme.spacing(1)
  }
}));
export default function DunamicMUITable({
  urlLink,
  title,
  addNew,
  columnsCustom
}) {
  const classes = useStyles();
  const [isLoading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const [params, setParams] = useState([{
    name: "ordering",
    value: ""
  }, {
    name: "status",
    value: ""
  }, {
    name: "search",
    value: ""
  }, {
    name: "page",
    value: 1
  }]);
  const [data, setData] = useState([["Loading Data..."]]);
  const [columns, setColumns] = useState([]);
  let id_token = useSelector(state => state.user.id_token);
  let resetList = useSelector(state => state.api.resetList);
  useEffect(() => {
    setLoading(true);
    dispatch(getListData(urlLink + "/?" + params.map(item => item.name + "=" + item.value + "&").join(""), id_token, false)).then(res => {
      setColumns(generate_columns(res.data.results, columnsCustom));
      setData(res.data);
      setLoading(false);
    });
  }, [urlLink, params, resetList]);

  const mui_table_action = (page, table_state) => {
    let sort_string = "";
    let sort_array = table_state.columns.filter(item => item.sortDirection === "desc" || item.sortDirection === "asc");
    sort_string = sort_array.map(item => {
      if (item.sortDirection === "desc") {
        return item.name;
      } else {
        return "-" + item.name;
      }
    }).join(",");
    let filter_list = columnsCustom.filter(column_row => column_row.filter);
    let custom_filter_params = filter_list.map(fl => {
      let temp_list_filter = table_state.filterList[table_state.columns.findIndex(x => x.name === fl.name)];

      if (temp_list_filter && temp_list_filter.length !== 0) {
        return {
          name: fl.name,
          value: temp_list_filter.map(keyValue => keyValue).join(",")
        };
      } else {
        return {
          name: "",
          value: ""
        };
      }
    });
    setParams([{
      name: "ordering",
      value: sort_string
    }, {
      name: "search",
      value: table_state.searchText ? table_state.searchText : ""
    }, {
      name: "page",
      value: page + 1
    }, ...custom_filter_params]);
  };

  var options = {
    responsive: "stacked",
    serverSide: true,
    count: data.count,
    rowsPerPage: 10,
    rowsPerPageOptios: [],
    onTableChange: (action, tableState) => {
      if (action === "sort" || action === "changePage" || action === "search" || action === "filterChange") {
        mui_table_action(tableState.page, tableState);
      }
    },
    filterType: "multiselect",
    filter: true,
    selectableRows: "none",
    selectableRowsOnClick: false,
    download: false,
    print: false,
    // download: user_data.groups.includes(6),
    // print: user_data.groups.includes(6),
    customToolbar: () => {
      if (addNew) {
        return addNew;
      } else {
        return true;
      }
    }
  };
  return /*#__PURE__*/React.createElement(Paper, {
    variant: "outlined",
    elevation: 3
  }, /*#__PURE__*/React.createElement(MUIDataTable, {
    title: /*#__PURE__*/React.createElement(Typography, {
      variant: "h6"
    }, title + " ", isLoading && /*#__PURE__*/React.createElement(CircularProgress, {
      size: 24,
      className: classes.progress
    })),
    columns: columns,
    options: options,
    data: data.results
  }));
}