const app = new Vue({
    el: '#app',
    data: {
        db: openDatabase('dragontail', '1.0', 'Dragon Tail Exams', 2 * 1024 * 1024),
        title: "App Welcome",
        headers: ["Name", "Type", "Phone", "Location"],
        info: []
    },
    computed: {
        mytable: function () {
            const tableHeader = '<thead>' + this.headers.reduce((acc, header) => acc + `<th>${header}</th>`, '<tr>') + '</tr>' + '</thead>'
            const tableBody = this.info.reduce((acc, row) => acc + this.buildTableRow(row), '')
            return '<table>' + tableHeader + tableBody + '</table>'
        }
    },
    watch: {
        info: function(a,b){
            a.forEach(this.insertRowToDB)
        }
    },
    methods: {
        buildTableRow: function (arrayInfo) {
            return '<tr>' + arrayInfo.map(tableData => `<td>${tableData}</td>`).join('') + '</tr>'
        },
        buildTableData: function(tableData){
            return tableData?`<td>${tableData}<td>`:''
        },
        insertRowToDB: function(arrayInfo){
            this.db.transaction(function (tx) {
                tx.executeSql('insert into restaurants (name, type, phone, location) values(?, ?, ?, ?)', arrayInfo);
             });
        }
    },
    mounted: function(){
        this.db.transaction(tx => {
            info = this.info
            tx.executeSql('CREATE TABLE IF NOT EXISTS restaurants (id INTEGER PRIMARY KEY, name VARCHAR UNIQUE, type VARCHAR, phone VARCHAR, location VARCHAR)', [], function(tx, result){
                tx.executeSql("SELECT * FROM restaurants", [], (tx, result) => {
                        for (i = 0; i < result.rows.length; i++) { 
                            let {name, type, phone, location} = result.rows.item(i); 
                            info.push([name, type, phone, location])
                        } 
                })
            });
         });
    }
})

new Vue({
    el: '#upload_csv',
    data: {},
    methods: {
        upload: () => {
            const {
                files
            } = document.getElementById("csv_file")
            if (!files || files.length != 1) {
                return alert("choose file to upload")
            }
            const file = files[0]

            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = function (event) {
                const csvData = event.target.result;
                const data = Papa.parse(csvData);
                const headers = data.data[0]
                const info = data.data.slice(1, data.data.length - 1)
                app.headers = headers;
                app.info = info
            }
        }
    }
})
