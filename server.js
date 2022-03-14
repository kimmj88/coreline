var http = require('http');
var url = require('url');
var querystring = require('querystring');

var sql = require('mssql');
var config = {
    user: 'sa',
    password: 'coreline',
    server: '10.77.1.31',
    port: 1433,
    database: 'coreline',
    stream: true,
	encrypt: false
}
sql.connect(config, function(err){
    if(err){
        return console.error('error : ', err);
    }
    console.log('MSSQL connect Success')
})

//kim min jae
process.on('uncaughtException', function (err) {
    console.error('error what?');
});

var server = http.createServer(function(request,response){

    var parsedUrl = url.parse(request.url);
    var resource = parsedUrl.pathname;
    
    var parsedUrl = url.parse(request.url);
    var parsedQuery = querystring.parse(parsedUrl.query,'&','=');
    
    var request = new sql.Request();

    if(resource == '/notification_storage_sts'){
        response.writeHead(200, {'Content-Type':'text/html'});

        var input_hdd_capacity = parsedQuery.hdd_capacity;
        var input_hospital_name = parsedQuery.hospital_name;

        
        request.stream = true;

        request.input('_hdd_capacity', sql.VarChar, input_hdd_capacity);
        request.input('_hospital_name', sql.VarChar, input_hospital_name);
        
        var q = "insert into notification_info(hdd_capacity, hospital_name) values(@_hdd_capacity, @_hospital_name)"
        request.query(q, (err, recordset) =>{
            if(err){
                consnole.log('query error :', err)
            }
            else{
                console.log('insert 완료')
            }
        })
        response.end('save_notification_storage_sts');
    }
    else if(resource == '/aview_version_sts'){
        response.writeHead(200, {'Content-Type':'text/html'});

        var input_license_number = parsedQuery.license_number;
        var input_hospital_key = parsedQuery.hospital_key;
        var input_expire_date = parsedQuery.expire_date;
        var input_aview_version = parsedQuery.aview_version;

        request.stream = true;

        request.input('_license_number', sql.VarChar, input_license_number);
        request.input('_hospital_key', sql.Int, input_hospital_key);
        request.input('_expire_date', sql.VarChar, input_expire_date);
        request.input('_aview_version', sql.VarChar, input_aview_version);
        
        var q = "insert into license_info(license_number, hospital_key, expire_date, schema_version) values(@_license_number, @_hospital_key, @_expire_date, @_aview_version)"

        request.query(q, (err, recordset) =>{
            if(err) throw err;
            else console.log('insert 완료')
        })
        response.end('save_notification_storage_sts');
    }
    
});

server.listen(8000, function(){
    console.log('Server is running...');
});