// Axeda test..........
var myModel                     = "MN7";
var mySn                        = 900425000022;
//var myModel                     = "MN47";
//var mySn                        = 916452000003;
//var myPlatformUrl               = "https://nextivity-sandbox-connect.axeda.com:443/ammp/";
var myPlatformUrl           = "https://nextivity-connect.axeda.com:443/ammp/";

var MainLoopIntervalHandle      = null;
var uMainLoopCounter            = 0;
var uMainLoopCounterMax         = 30;



var loopState                   = null;

const   STATE_GET_USER_INFO     = 0;
const   STATE_GET_SKU           = 1;
const   STATE_GET_REG_INFO      = 2;
const   STATE_GET_UPDATE_FALSE  = 3;
const   STATE_GET_UPDATE_TRUE   = 4;

const   STATE_DONE              = 10;




// Use window.isPhone to show global var or just use without "window." ...
var isPhone      = false;
var isRegistered = true;

const   MAIN_LOOP_COUNTER_MAX   = 20;
const   SwPnNuCu                = "700.036.";
const   SwPnPic                 = "700.040.";
const   SwPnBt                  = "700.041.";


// User info.................................
var bGotUserInfoRspFromCloud    = false;
var getUserInfoActionFromCloud  = null;


// Reg info..................................
var bGotRegInfoRspFromCloud     = false;
var myRegOpForceFromCloud       = null;
var myRegDataFromOp             = null;


// Fixed file names to search for in the package info...
const myNuCfFileName                = "WuExecutable.sec";        
const myCuCfFileName                = "CuExecutable.sec";  
const myNuPicFileName               = "NuPICFlashImg.bin";  
const myCuPicFileName               = "CuPICFlashImg.bin";
const myBtFileName                  = "BTFlashImg.bin";

var fileNuCfCldId                   = 0;  
var fileCuCfCldId                   = 0;  
var fileNuPicCldId                  = 0;
var fileCuPicCldId                  = 0;
var fileBtCldId                     = 0;
var isUpdateAvailableFromCloud      = false;
var bGotUpdateAvailableRspFromCloud = false;
var bGotPackageAvailableRspFromCloud = false;


// PrintLog............................................................................................
function PrintLog(level, txt)
{
    var d = new Date();
    var myBox = document.getElementById('textBox_id');

    if( level == 1 )
    {
        myBox.value += "\n(" + d.getMinutes() + ":" + d.getSeconds() + ")" + txt;
    }
    else if( level == 2 )
    {
        // Add a blank line
        myBox.value += "\n\n(" + d.getMinutes() + ":" + d.getSeconds() + ")" + txt;
    }
    else if( level == 3 )
    {
        // Add a blank line before and after
        myBox.value += "\n\n(" + d.getMinutes() + ":" + d.getSeconds() + ")" + txt + "\n";
    }
    else
    {
        myBox.value += "\n(" + d.getMinutes() + ":" + d.getSeconds() + ")" + txt;
    }

    myBox.scrollTop = myBox.scrollHeight;
}



function renderView()
{
    var myHtml = 
  
    "<br>" +
    "<div class='downloadSelectContainer'>" +
    "<table id='axedaTable' align='left'>" +
    "<tr> <th id='asset_id' style='padding: 10px;' colspan='4'>Axeda Test Menu - </th></tr>" + 
    "<tr> <th>Test</th>  <th>Action</th> <th>Status</th> <th>Description</th> </tr>" +
    "<tr> <td><br>Get User Info</td> <td><input type='button' value='Start Test' onclick='getUserTest()'></input></td>            <td id='s0'>Not Started</td>  <td class='desc'>Send getUserInfoAction:false then true.<br>Poll every 2 sec until 'getUserInfoAction' is sent back, 30 polls max.</td></tr>" +
    "<tr> <td><br>Get SKU</td>       <td><input type='button' value='Start Test' onclick='getSkuTest()'></input></td>             <td id='s1'>Not Started</td>  <td class='desc'>Send SKU_Number:'test' to clear.<br>Send 'UniqueId':'0x4713e3b9a4a30a20'.<br>SKU_Number should be updated to: 590N412-002-10.</td></tr>" +
    "<tr> <td><br>Get Reg Info</td>  <td><input type='button' value='Start Test' onclick='getRegTest()'></input></td>             <td id='s2'>Not Started</td>  <td class='desc'>Send 'regAction':'false' then 'regAction':'true'.<br>Poll every 2 sec until 'regOpForce' is sent back, 30 polls max.</td></tr>" +
    "<tr> <td><br>Get Update False</td>  <td><input type='button' value='Start Test' onclick='getUpdateFalseTest()'></input></td> <td id='s3'>Not Started</td>  <td class='desc'>Send 'SwVerCU_CF':'700.036.099.099'. <br>Send 'isUpdateAvailable':'false' then 'isUpdateAvailable':'true'.<br>Poll every 2 sec until 'isUpdateAvailable' is sent back, 30 polls max.</td></tr>" +
    "<tr> <td><br>Get Update True</td>   <td><input type='button' value='Start Test' onclick='getUpdateTrueTest()'></input></td>  <td id='s4'>Not Started</td>  <td class='desc'>Send 'SwVerCU_CF':'700.036.000.000'. <br>Send 'isUpdateAvailable':'false' then 'isUpdateAvailable':'true'.<br>Poll every 2 sec until 'isUpdateAvailable' is sent back, 30 polls max.</td></tr>" +
    "</table> </div>" +
    
    "<textarea id='textBox_id' rows='40' cols='120'>Axeda Test Log (Run with IE, not Chrome)</textarea>";
    
    $('body').html(myHtml); 
                
    document.getElementById('asset_id').innerHTML += "  Model: " + myModel + " SN: " + mySn;

}

// User............................................................................................
function getUserTest()
{
    PrintLog(2, "Get User Info key pressed." );
    SendCloudAsset();
    SendCloudData( "'getUserInfoAction':'false'" );
    SendCloudData( "'getUserInfoAction':'true'" );
    uMainLoopCounter           = 0;
    bGotUserInfoRspFromCloud   = false;
    getUserInfoActionFromCloud = null;
    loopState                  = STATE_GET_USER_INFO;
    MainLoopIntervalHandle = setInterval( mainLoop, 2000 );
    document.getElementById('s0').innerHTML = "Starting";
     
}


// SKU............................................................................................
function getSkuTest()
{
    PrintLog(2, "Get SKU Test key pressed." );
    SendCloudAsset();
    SendCloudData( "'SKU_Number':'test'" );
    
    loopState                  = STATE_GET_SKU;
    MainLoopIntervalHandle = setInterval( mainLoop, 2000 );
    document.getElementById('s1').innerHTML = "Starting";
     
}


// Registration............................................................................................
function getRegTest()
{
    PrintLog(2, "Get Reg Info key pressed." );
    SendCloudAsset();
    SendCloudData( "'regAction':'false'" );
    SendCloudData( "'regAction':'true'" );
    uMainLoopCounter           = 0;
    bGotRegInfoRspFromCloud    = false;
    loopState                  = STATE_GET_REG_INFO;
    MainLoopIntervalHandle = setInterval( mainLoop, 2000 );
    document.getElementById('s2').innerHTML = "Starting";
     
}


// Get Update False............................................................................................
// Set the SwVerCU_CF version greater than the package version so that isUpdateAvailable should return a false.
function getUpdateFalseTest()
{
    PrintLog(2, "Get Update False key pressed." );
    SendCloudAsset();
    SendCloudData( "'SwVerCU_CF':'700.036.099.099'" );    
    SendCloudData( "'isUpdateAvailable':'false'" );

    uMainLoopCounter                = 0;
    bGotUpdateAvailableRspFromCloud = false;
    loopState                       = STATE_GET_UPDATE_FALSE;
    MainLoopIntervalHandle = setInterval( mainLoop, 2000 );
    document.getElementById('s3').innerHTML = "Starting";
}



// Get Update True............................................................................................
// Set the SwVerCU_CF version less than the package version so that isUpdateAvailable should return a true.
// Also wait for "package" from Axeda.
function getUpdateTrueTest()
{
    PrintLog(2, "Get Update True key pressed." );
    SendCloudAsset();
    SendCloudData( "'SwVerCU_CF':'700.036.000.000'" );    
//    SendCloudData( "'SwVerCU_CF':'700.036.ede.ded'" );    
    SendCloudData( "'isUpdateAvailable':'false'" );
    uMainLoopCounter                 = 0;
    bGotUpdateAvailableRspFromCloud  = false;
    bGotPackageAvailableRspFromCloud = false;    
    fileNuCfCldId                    = 0;
    fileCuCfCldId                    = 0;
    fileNuPicCldId                   = 0;
    fileCuPicCldId                   = 0;
    fileBtCldId                      = 0;
    
    loopState                       = STATE_GET_UPDATE_TRUE;
    MainLoopIntervalHandle = setInterval( mainLoop, 2000 );
    document.getElementById('s4').innerHTML = "Starting";
}






// main loop............................................................................................
function mainLoop()
{

    uMainLoopCounter++;
        
    switch(loopState)
    {
        case STATE_GET_USER_INFO:
        {
            if( bGotUserInfoRspFromCloud )
            {
                PrintLog(1, "Get User Info Passed.  Egress response: getUserInfoAction from cloud = " + getUserInfoActionFromCloud );
                clearInterval(MainLoopIntervalHandle);
                document.getElementById('s0').innerHTML = "Pass";
            } 
            else
            {
                SendCloudPoll();        
                document.getElementById('s0').innerHTML = "Poll: " + uMainLoopCounter;
            } 
            break;
        }


        case STATE_GET_SKU:
        {
            SendCloudData( "'UniqueId':'0x4713e3b9a4a30a20'" );         // Should cause the Axeda code to get 590N412-002-10
            document.getElementById('s1').innerHTML = "Check Axeda";
            clearInterval(MainLoopIntervalHandle);
            break;
        }

        case STATE_GET_REG_INFO:
        {
            if( bGotRegInfoRspFromCloud )
            {
                PrintLog(1, "Get Reg Info Passed.  Egress response: regOpForce from cloud = " + myRegOpForceFromCloud );
                clearInterval(MainLoopIntervalHandle);
                document.getElementById('s2').innerHTML = "Pass";
            }
            else
            {
              SendCloudPoll();        
              document.getElementById('s2').innerHTML = "Poll: " + uMainLoopCounter;
            }  
            break;
        }


        case STATE_GET_UPDATE_FALSE:
        {
            if( uMainLoopCounter == 1 )
            {
                SendCloudData( "'isUpdateAvailable':'true'" );
            }
                  
            if( bGotUpdateAvailableRspFromCloud )
            {
                clearInterval(MainLoopIntervalHandle);
                if( isUpdateAvailableFromCloud == "true" )
                {
                    PrintLog(1, "Get Update False: Failed.  Egress response: isUpdateAvailable from cloud = " + isUpdateAvailableFromCloud );
                    document.getElementById('s3').innerHTML = "Fail";
                }
                else
                {
                    PrintLog(1, "Get Update False: Passed.  Egress response: isUpdateAvailable from cloud = " + isUpdateAvailableFromCloud );
                    document.getElementById('s3').innerHTML = "Pass";
                }
                
            }
            else
            {
                SendCloudPoll();  
                document.getElementById('s3').innerHTML = "Poll: " + uMainLoopCounter;
            }
               
            break;
        }


        case STATE_GET_UPDATE_TRUE:
        {
            if( uMainLoopCounter == 1 )
            {
                SendCloudData( "'isUpdateAvailable':'true'" );
            }
        
            if( bGotUpdateAvailableRspFromCloud && bGotPackageAvailableRspFromCloud )
            {
                clearInterval(MainLoopIntervalHandle);
                if( isUpdateAvailableFromCloud == "true" )
                {
                    PrintLog(1, "Get Update True: Passed.  Egress response: isUpdateAvailable from cloud = " + isUpdateAvailableFromCloud );
                    document.getElementById('s4').innerHTML = "Pass";
                }
                else
                {
                    PrintLog(1, "Get Update True: Failed.  Egress response: isUpdateAvailable from cloud = " + isUpdateAvailableFromCloud );
                    document.getElementById('s4').innerHTML = "Fail";
                }
                
            }
            else
            {
                SendCloudPoll();  
                document.getElementById('s4').innerHTML = "Poll: " + uMainLoopCounter;
            }  
            break;
        }


        
        case STATE_DONE:
        {
            PrintLog( 1, "Done..." );
            clearInterval(MainLoopIntervalHandle);
            break;
        }
        
    }
    

            
    if( uMainLoopCounter >= uMainLoopCounterMax )
    {
        // Clear the loop timer to stop the loop...
        clearInterval(MainLoopIntervalHandle);
        
        PrintLog(1, "Loop max reached..." );
        
        switch(loopState)
        {
            case STATE_GET_USER_INFO:
            {
                document.getElementById('s0').innerHTML = "Fail";
                break;
            }

            case STATE_GET_REG_INFO:
            {
                document.getElementById('s2').innerHTML = "Fail";
                break;
            }

            case STATE_GET_UPDATE_FALSE:
            {
                document.getElementById('s3').innerHTML = "Fail";
                break;
            }

            case STATE_GET_UPDATE_TRUE:
            {
                document.getElementById('s4').innerHTML = "Fail";
                break;
            }

            
        }
        
        
    }

}


// ProcessEgressResponse......................................................................................
function ProcessEgressResponse(eg)
{
    var i;
    var egStr;
    
    //  Set items loook like....    
    // {set:[
    //          {items:{firstName:"John"},priority:0},
    //          {items:{lastName:"Doe"},priority:0},
    //          {items:{city:"San Clemente"},priority:0},
    //          {items:{getUserInfoAction:"true"},priority:0},
    //      ]  
    //  } ;
    
    egStr = JSON.stringify(eg);
    if( egStr.search("set") != -1 )
    {
//        PrintLog(1, "Egress: Number of set items equals " + eg.set.length );
    
        for( i = 0; i < eg.set.length; i++ )
        {
            egStr = JSON.stringify(eg.set[i].items);
            
            // Search for strings associated with getUserInfoAction (search() returns -1 if no match found)
            //   getUserInfoAction returns false if there is no information but set bGotUserInfoRspFromCloud
            //   just to know that the cloud has returned nothing or something.
            if(      egStr.search("getUserInfoAction") != -1 )   {bGotUserInfoRspFromCloud  = true;  getUserInfoActionFromCloud = eg.set[i].items.getUserInfoAction; }
                     
/*                     
            else if( egStr.search("firstName")         != -1 )   szRegFirstName             = eg.set[i].items.firstName;        
            else if( egStr.search("lastName")          != -1 )   szRegLastName              = eg.set[i].items.lastName;        
            else if( egStr.search("addr_1")            != -1 )   szRegAddr1                 = eg.set[i].items.addr_1;        
            else if( egStr.search("addr_2")            != -1 )   szRegAddr2                 = eg.set[i].items.addr_2;
            else if( egStr.search("city")              != -1 )   szRegCity                  = eg.set[i].items.city;
            else if( egStr.search("state")             != -1 )   szRegState                 = eg.set[i].items.state;
            else if( egStr.search("zip")               != -1 )   szRegZip                   = eg.set[i].items.zip;
            else if( egStr.search("country")           != -1 )   szRegCountry               = eg.set[i].items.country;
            else if( egStr.search("phone")             != -1 )   szRegPhone                 = eg.set[i].items.phone;
  */
                    
            // Search for strings associated with Registration egress...
            else if( egStr.search("regOpForce")        != -1 )   {bGotRegInfoRspFromCloud = true; myRegOpForceFromCloud      = eg.set[i].items.regOpForce;}       // true to force
            else if( egStr.search("regDataFromOp")     != -1 )   myRegDataFromOp            = eg.set[i].items.regDataFromOp;
    
            
            // Search for strings associated with Software Download egress...
            else if( egStr.search("isUpdateAvailable") != -1 )  {isUpdateAvailableFromCloud       = eg.set[i].items.isUpdateAvailable;  bGotUpdateAvailableRspFromCloud  = true;}
            
/*            
            else if( egStr.search("SwVerNU_CF_CldVer") != -1 )   nxtySwVerNuCfCld                 = eg.set[i].items.SwVerNU_CF_CldVer;
            else if( egStr.search("SwVerCU_CF_CldVer") != -1 )   nxtySwVerCuCfCld                 = eg.set[i].items.SwVerCU_CF_CldVer;
            else if( egStr.search("SwVerNU_PIC_CldVer") != -1 )  nxtySwVerNuPicCld                = eg.set[i].items.SwVerNU_PIC_CldVer;
            else if( egStr.search("SwVerCU_PIC_CldVer") != -1 )  nxtySwVerCuPicCld                = eg.set[i].items.SwVerCU_PIC_CldVer;
            else if( egStr.search("SwVer_BT_CldVer")    != -1 )  nxtySwVerBtCld                   = eg.set[i].items.SwVer_BT_CldVer;
*/            
        }
        
        
    }


    // packages look like...
    // {packages:[
    //                  {id:641, instructions:[
    //                      {@type:down, id:921, fn:"WuExecutable.sec", fp:"."}], priority:0, time:1414810929705},
    //                  {id:642, instructions:[
    //                      {@type:down, id:922, fn:"BTFlashImg.bin", fp:"."}], priority:0, time:1414810929705}
    //               ]

    egStr = JSON.stringify(eg);
    if( egStr.search("packages") != -1 )
    {
        PrintLog(1, "Egress: Number of package instructions equals " + eg.packages.length );
        
        
        // Find the fixed file names and save the file ID numbers.   Note that the first ID is the package ID.
        //  File name "PICFlashImg.bin" is used for both the NU and CU PICs.
        //  Future proof in case there are different PIC images: "NuPICFlashImg.bin" and "CuPICFlashImg.bin"
        for( i = 0; i < eg.packages.length; i++ )
        {
            egStr = JSON.stringify(eg.packages[i].instructions);
            
            var packageId = eg.packages[i].id;
            SendCloudEgressStatus(packageId, 0);    // Indicate QUEUED
            SendCloudEgressStatus(packageId, 2);    // Indicate SUCCESS
            
            // Search for strings associated with software download (search() returns -1 if no match found)
            if(      egStr.search(myNuCfFileName)   != -1 )   fileNuCfCldId   = eg.packages[i].instructions[0].id;        
            else if( egStr.search(myCuCfFileName)   != -1 )   fileCuCfCldId   = eg.packages[i].instructions[0].id;  
            else if( egStr.search("PICFlashImg")    != -1 )   fileNuPicCldId  = fileCuPicCldId = eg.packages[i].instructions[0].id;  
            else if( egStr.search(myNuPicFileName)  != -1 )   fileNuPicCldId  = eg.packages[i].instructions[0].id;                     // Future proof  
            else if( egStr.search(myCuPicFileName)  != -1 )   fileCuPicCldId  = eg.packages[i].instructions[0].id;                     // Future proof
            else if( egStr.search(myBtFileName)     != -1 )   fileBtCldId     = eg.packages[i].instructions[0].id;
        }
        
        if( fileNuCfCldId || fileCuCfCldId || fileNuPicCldId || fileCuPicCldId || fileBtCldId )
        {
            bGotPackageAvailableRspFromCloud = true;    
        }
        
    }  
    
    
// PrintLog(1, "Egress:  bGotUserInfoRspFromCloud=" + bGotUserInfoRspFromCloud + " getUserInfoActionFromCloud=" + getUserInfoActionFromCloud );    
// PrintLog(1, "Egress:  isUpdateAvailableFromCloud=" + isUpdateAvailableFromCloud + " bGotUpdateAvailableRspFromCloud=" + bGotUpdateAvailableRspFromCloud + " bGotPackageAvailableRspFromCloud=" + bGotPackageAvailableRspFromCloud );    
    
}







// SendCloudAsset............................................................................................
function SendCloudAsset()
{
//    if( isNxtyStatusCurrent && isNxtySnCurrent && isNetworkConnected )
    {
        var myAsset    = "{'id': {'mn':'" + myModel + "', 'sn':'" + mySn + "', 'tn': '0' }, 'pingRate': 3600 }";
        var myAssetUrl = myPlatformUrl + "assets/1";
        
        PrintLog( 1, "SendCloudAsset: " + myAssetUrl + "  " + myAsset );
        
        
        $.ajax({
            type       : "POST",
//            crossDomain: true,
            url        : myAssetUrl,
            contentType: "application/json;charset=utf-8",
            data       : myAsset,
            dataType   : 'json',    // response format
            success    : function(response) 
                        {
                            if( response != null )
                            {
                                PrintLog( 3, "Response success: SendCloudAsset()..." + JSON.stringify(response) );
                                ProcessEgressResponse(response);
                            }
                        },
            error      : function(response) 
                        {
                            PrintLog( 99, "Response error: SendCloudAsset()..." + JSON.stringify(response) );
                        }
        });
        
        
    }

}

// SendCloudData............................................................................................
function SendCloudData(dataText)
{
//    if( (myModel != null) && (mySn != null) && isNetworkConnected )
    {
        var myData    = "{'data':[{'di': {" + dataText + "}}]}";
        var myDataUrl = myPlatformUrl + "data/1/" + myModel + "!" + mySn;
        
        PrintLog( 1, "SendCloudData: " + myDataUrl + "  " + myData );
        
        
        $.ajax({
            type       : "POST",
//            crossDomain: true,            
            url        : myDataUrl,
            contentType: "application/json;charset=utf-8",
            data       : myData,
            dataType   : 'json',    // response format
            success    : function(response) 
                        {
                            if( response != null )
                            {
                                PrintLog( 3, "Response success: SendCloudData()..." + JSON.stringify(response)  );
                                ProcessEgressResponse(response);
                            }
                        },
            error      : function(response) 
                        {
                            PrintLog( 99, "Response error: SendCloudData()..." + JSON.stringify(response) );
                        }
        });


        
    }
}

// SendCloudLocation............................................................................................
function SendCloudLocation(lat, long)
{
//    if( (myModel != null) && (mySn != null) && isNetworkConnected )
    {
        var myData    = "{'locations':[{'latitude':" + lat + ", 'longitude':" + long + "}]}";
        var myDataUrl = myPlatformUrl + "data/1/" + myModel + "!" + mySn;
        
        PrintLog( 1, "SendCloudLocation: " + myDataUrl + "  " + myData );
        
        
        $.ajax({
            type       : "POST",
//            crossDomain: true,            
            url        : myDataUrl,
            contentType: "application/json;charset=utf-8",
            data       : myData,
            dataType   : 'json',    // response format
            success    : function(response) 
                        {
                            if( response != null )
                            {
                                PrintLog( 3, "Response success: SendCloudLocation()..." + JSON.stringify(response) );
                                ProcessEgressResponse(response);
                            }
                        },
            error      : function(response) 
                        {
                            PrintLog( 99, "Response error: SendCloudLocation()..." + JSON.stringify(response) );
                        }
        });
        
        
    }
}


// 'http://nextivity-sandbox-connect.axeda.com/ammp/packages/1/1879/status/MN7!900425000022

// SendCloudEgressStatus............................................................................................
function SendCloudEgressStatus(packageId, myStatus)
{
//    if( (myModel != null) && (mySn != null) && isNetworkConnected )
    {
        var myData    = "{'status':" + myStatus + "}";
        var myDataUrl = myPlatformUrl + "packages/1/" + packageId + "/status/" + myModel + "!" + mySn;
        
        PrintLog( 1, "SendCloudEgressStatus: " + myDataUrl + "  " + myData );
        
        
        $.ajax({
            type       : "PUT",
            crossDomain: true,            
            url        : myDataUrl,
            contentType: "application/json;charset=utf-8",
            data       : myData,
            dataType   : 'json',    // response format
            success    : function(response) 
                        {
                            if( response != null )
                            {
                                PrintLog( 3, "Response success: SendCloudEgressStatus()..." + JSON.stringify(response) );
                                ProcessEgressResponse(response);
                            }
                        },
            error      : function(response) 
                        {
                            PrintLog( 99, "Response error: SendCloudEgressStatus()..." + JSON.stringify(response) );
                        }
        });
        
        
    }
}


// SendCloudPoll............................................................................................
function SendCloudPoll()
{
//    if( isNxtyStatusCurrent && isNxtySnCurrent && isNetworkConnected )
    {
        var myAssetUrl = myPlatformUrl + "assets/1/" + myModel + "!" + mySn;
        
        PrintLog( 1, "SendCloudPoll: " + myAssetUrl );
        
        
        $.ajax({
            type       : "POST",
//            crossDomain: true,            
            url        : myAssetUrl,
//            contentType: "application/json;charset=utf-8",
//            data       : myAsset,
            dataType   : 'json',    // response format
            success    : function(response) 
                        {
                            if( response != null )
                            {
                                PrintLog( 3, "Response success: SendCloudPoll()..." + JSON.stringify(response) );
                                ProcessEgressResponse(response);
                            }
                        },
            error      : function(response) 
                        {
                            PrintLog( 99, "Response error: SendCloudPoll()..." + JSON.stringify(response) );
                        }
        });
        
        
    }
}










	
