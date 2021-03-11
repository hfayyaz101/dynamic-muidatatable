## Dynamic MUI Table

Its designed to handle _DJango_ generic class pagination api with filter, search and sorting functionality. This component have following features.

> **Note:** Requires [redux-axios-jwt](https://www.npmjs.com/package/redux-axios-jwt) npm package. Please set it up before using this.

> This componenet is built upon MUI Datatable and Redux. [MUI Datatable](https://github.com/gregnb/mui-datatables)

- Pagination
- Sorting
- Filter
- Search
- Download
- New custom columns
- Custom Actions

### Sample code for DJango generic API

Following is a sample DJango DRF generic pagination api. For ref: [Pagination - DRF](https://www.django-rest-framework.org/api-guide/pagination/)

```py
class VehiclePaginationView(generics.ListAPIView):
	authentication_classes = (authentication.JWTAuthentication,)
	permission_classes = [permissions.IsAuthenticated]

	queryset = vehicle.objects.filter(de_fleeted=False).order_by('vehicle_reg_no')
	serializer_class = CustomVehicleDetialSerializer
	filter_backends = [
			rest_framework.DjangoFilterBackend,
			filters.OrderingFilter,
			filters.SearchFilter
		]
	ordering_fields = (
			'vehicle_reg_no',
			'id',
			'date_added'
		)
	filter_fields = ('hire_status', 'make', 'model')
	search_fields = (
			'vehicle_reg_no',
			'supplier_id__first_name',
			'manufacturer_id__company'
		)
```

### Usage in React JS/Next JS

#### npm install

    npm i dynamic-muidatatable

Following is a sample implementation code.

```js
import DynamicMUITable from "./DynamicMUITable"

const VehicleProfileCard = (value, tableMeta, updateValue) => {
	return (
		<ProfileCard reg_number={value.vehicle_reg_no} vehicle_id={value.id} />
	);
};

const ActionButtons = (value, tableMeta, updateValue) => {
	return (
		<>
            <ServiceDialog rowId={value} method="put" />
            <DeleteServiceDialog rowId={value} />
		</>
	);
};

const columnsCustom = [
	{
        name: "vehicle",
        label: "Reg Number",
        vehicle: true,
        sort: true,
        comp: VehicleProfileCard,
        display: true,
        filter: true,
        filterOptions: [],
        filterType: "dropdown",
        value: "reg_number",
	},
	new: [
            {
            	name: "id",
                label: "Label",
                comp: ActionButtons,
            }
	]
 ]

export default function DataTable() {
	return (
		<DynamicMUITable
		title="Table Title"
		urlLink="vehicle_accessories/service/list"
		columnsCustom={columnsCustom}
		/>
	)
}
```

#### API

```js
<DynamicMUITable />
```

The component accepts the following props.
| Name | Type | Description |
| ------------------- | ----- | -------------------------------------------------------------------------------------------------------- |
| **`title`** | array | Title used to caption table |
| **`columnsCustom`** | array | Columns used to describe table. Must be either an array of simple strings or objects describing a column |
| **`urlLink`** | array | API link to make a call to get data from the server |

##### Customize columnsCustom

On each column object, you have the ability to customize columns to your liking.
| Name | Type | Default | Description |
| ------------------- | ----------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`name`** | string | | Name of column (This field is required) |
| **`label`** | string | | Column Header Name override |
| **`vehicle`** | boolean | false | Incase, its main vehicle column |
| **`sort`** | boolean | false | Enable/disable sorting on column. |
| **`comp`** | function | | Custom function you want to show. `function(value, tableMeta, updateValue) { return (<Component />)}` |
| **`value`** | array | | In case column is an object. This value defines to show specific index of the object. For e.g. `vehicle: {id: 1, reg_number: "ABC-123"}`. If you want to print reg_number, than `{name: "vehicle", value: "reg_number"}`. |
| **`display`** | boolean or string | true | Display column in table. Possible values:<p><ul><li>true: Column is visible and toggleable via the View Columns popover in the Toolbar.</li><li>false: Column is not visible but can be made visible via the View Columns popover in the Toolbar.</li><li>excluded: Column is not visible and not toggleable via the View Columns popover in the Toolbar.</li></ul></p><p>See also: `viewColumns` and `filter` options.</p> |
| **`filter`** | boolean | false | Display column in filter list. |
| **`filterOptions`** | object | | <p><i>These options affect the filter display and functionality from the filter dialog. To modify the filter chips that display after selecting filters, see `customFilterListOptions`</i></p><p>This option is an object of several options for customizing the filter display and how filtering works.</p><p><ul><li>names: custom names for the filter fields [Example](https://github.com/gregnb/mui-datatables/blob/master/examples/column-filters/index.js)</li><li>logic: custom filter logic [Example](https://github.com/gregnb/mui-datatables/blob/master/examples/customize-filter/index.js)</li><li>display(filterList, onChange(filterList, index, column), index, column, filterData): Custom rendering inside the filter dialog [Example](https://github.com/gregnb/mui-datatables/blob/master/examples/customize-filter/index.js). `filterList` must be of the same type in the main column options, that is an array of arrays, where each array corresponds to the filter list for a given column.</li><li>renderValue: A function to customize filter choices [Example](https://github.com/gregnb/mui-datatables/blob/master/examples/customize-filter/index.js). Example use case: changing empty strings to "(empty)" in a dropdown.</li><li>fullWidth (boolean): Will force a filter option to take up the grid's full width.</li></ul></p> |
| **`filterType `** | string | 'dropdown' | Choice of filtering view. Takes priority over global filterType option.`enum('checkbox', 'dropdown', 'multiselect', 'textField', 'custom')` Use 'custom' if you are supplying your own rendering via `filterOptions`. |

##### Cutom Columns

Insert **`new`** key in object as shown in example above.

| Name        | Type     | Description                                                                                           |
| ----------- | -------- | ----------------------------------------------------------------------------------------------------- |
| **`name`**  | string   | Name of column (This field is required)                                                               |
| **`label`** | string   | Column Header Name override                                                                           |
| **`comp`**  | function | Custom function you want to show. `function(value, tableMeta, updateValue) { return (<Component />)}` |

> **Developed and Compiled:** Hamza Fayyaz (Hayan Systems)
