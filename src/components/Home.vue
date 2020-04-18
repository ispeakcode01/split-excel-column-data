<template>
  <v-container>
    <v-card outlined>
      <v-app-bar flat>
        <v-toolbar-title>Split Column Data</v-toolbar-title>
        <v-spacer></v-spacer>
        <downloadexcel
            class   = "btn btn-default"
              :data   = "tableData"
              :fields = "fields"
              type="csv"
              >
              <v-btn text outlined>
                <v-icon left>mdi-format-vertical-align-bottom</v-icon>
                Download
              </v-btn>
          </downloadexcel>
      </v-app-bar>
      <v-card-text>
        <v-progress-linear v-if="loading" :indeterminate="loading"></v-progress-linear>
        <div class="py-4"></div>
        <v-row 
        justify="center"
        class="text-center"
        >
          <v-col cols="5">
            <v-file-input accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" placeholder="Select excel file (.xlsx)" append-icon="mdi-folder-open" label="Input File" prepend-icon="" outlined dense v-on:change="fileInputed"></v-file-input>
          </v-col>
          <v-col cols="6">
            <v-row justify="center">
              <v-col cols="4">Column To Duplicate</v-col>
              <v-col cols="8">
              <v-select
              dense
              :items="columns"
              item-text="value"
              item-value="index"
              v-on:change="selectingColumnToDuplicate"

              label="Choose Column"
              outlined
            ></v-select>
            </v-col>
            <v-col cols="4">Column To Split</v-col>
              <v-col cols="8">
              <v-select
              dense
              v-on:change="selectingColumnToSplit"
              :items="columns"
              item-text="value"
              item-value="index"
              label="Choose Column"
              outlined
            ></v-select>
            <v-text-field
              dense
              :value="delimeter"
              v-model="delimeter"
              label="Enter character to split"
              outlined
            ></v-text-field>
            </v-col>
            <v-col cols="12" class="text-right">
              <v-btn class="btn" outlined v-on:click="process">Process</v-btn>
            </v-col>
            </v-row>
            
            
          </v-col>
          <v-col cols="12">
            
          </v-col>
          <v-col>
            <v-data-table
              :headers="headers"
              :items="tableData"
              :disable-sort="true"
              :items-per-page="50"
              class="elevation-1"
            >
            
            </v-data-table>
          </v-col>
        </v-row>
      </v-card-text>
      
    </v-card>
  </v-container>
</template>

<script>

import readXlsxFile from 'read-excel-file'
import readFileMixin from '../mixins/readXlxsFile';
import downloadexcel from "vue-json-excel";

  export default {
    name: 'HelloWorld',
    components: {
      downloadexcel,
    },
    mixins: [readFileMixin],

    data: () => ({
      loading: false,
      headers: [],  // table headers
      tableData: [],  // table data,
      columns: [],  // data for select tags
      selectedColumnToSplit: 0,
      selectedColumnToDuplicate: 0,
      delimeter: "",
      fields: {}
    }),
    methods: {
      selectingColumnToSplit: function(item) {
        // store the selected header index
        this.selectedColumnToSplit = item
      },
      selectingColumnToDuplicate: function(item) {
        // store the selected header index
        this.selectedColumnToDuplicate = item
      },
      process: function() {

        var newTableData = []
        
        // need to split the data in one of the column which
        // is determined by selectedColumnToSplit

        JSON.parse(JSON.stringify(this.tableData)).forEach(item => {

          // get the property table data object
          var property = this.headers[this.selectedColumnToSplit].value
          //var propertyToDuplicate = this.headers[this.selectedColumnToDuplicate].value
          var columnToSplit = item[property]
          //var toDuplicate = item[propertyToDuplicate]
          if (columnToSplit) {
             if (columnToSplit.includes(this.delimeter)) {
                var datas = columnToSplit.split(this.delimeter)
                item[property] = datas[0]// set the new value for image containing now just one data instead of multible
                // add it a new item
                newTableData.push(item)
                // perform the splitting
                datas.shift()

                var index = 0

                datas.forEach(dataSplittedItem => {
                var newItem = JSON.parse( JSON.stringify(item) ) // make a complete new version of the same item

                  // make a copy of item
                  this.headers.forEach(header => {
                    if (index !== this.selectedColumnToDuplicate) {
                      newItem[header.value] = ""
                    }

                    if (index === this.selectedColumnToSplit) {
                      newItem[header.value] = dataSplittedItem
                    }



                    index++;
                  })

                  newTableData.push(newItem)

                })

                



             } else {
               newTableData.push(item)
             }

          }

        })
        this.tableData = newTableData
        alert("Done")
      },
      fileInputed: function(file) {
        
        readXlsxFile(file).then(rows => {
          this.tableData = []
          this.headers = []
          this.columns = []
          this.excelRows = rows
          /**
           * Build our table headers
           */
          var headers = rows[0]
          var headerIndex = 0
          var obj = {}
          headers.forEach(headerItem => {
            this.columns.push({
              index: headerIndex,
              value: headerItem
            })
            var value = headerItem.split(" ").join("-")

            // build for exporting file
            // create a json string
            obj[headerItem] = value


            this.headers.push({
              text: headerItem,
              value: value,//'header' + headerIndex++,
              fixed: true,
              width: "200px"
            })
            headerIndex++
          });

          this.fields = obj

          /**
           * Fill up the table
           */
          headerIndex = 0
          var object = {}
          for (var i=1; i<rows.length; i++) {
            var tableData = rows[i]
            tableData.forEach(data => {
              var header = this.headers[headerIndex++].value
              object[header] = data
            })
            this.tableData.push(object)
            headerIndex = 0
            object = {}

          }
        })

        console.log("done")
      }
    }
  }
</script>
