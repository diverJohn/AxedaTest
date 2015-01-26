// Axeda test..........
var myModel                     = "MN7";
var mySn                        = 900425000022;
var myPlatformUrl               = "https://nextivity-sandbox-connect.axeda.com:443/ammp/";


var MainLoopIntervalHandle      = null;
var uMainLoopCounter            = 0;
var uMainLoopCounterMax         = 5;



var loopState                   = null;

const   STATE_GET_USER_INFO     = 0;
const   STATE_DONE              = 1;




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

    myBox.scrollTop = myBox.scrollHeight;
}



function renderView()
{
    var myHtml = 
  
    "<br><br><br>" +
    "<div class='downloadSelectContainer'>" +
    
    
    "<table id='axedaTable' align='left'>" +
    "<tr> <th style='padding: 10px;' colspan='4'>Axeda Test Menu</th></tr>" + 
    "<tr> <th>Test</th>  <th>Action</th> <th>Status</th> <th>Description</th> </tr>" +
    "<tr> <td><br>Get User Info</td> <td><input type='button' value='Start Test' onclick='getUserTest()'></input></td>     <td id='s0'>Not Started</td>  <td class='desc' id='d0'>Send getUserInfoAction:false then true.<br>Poll until getUserInfoAction is sent back, 30 seconds max.</td></tr>" +
    "<tr> <td><br>CU</td>     <td id='v1'></td>  <td id='c1'></td> <td id='s1'>N/A</td> </tr>" +
    "<tr> <td><br>NU PIC</td> <td id='v2'></td>  <td id='c2'></td> <td id='s2'>N/A</td> </tr>" +
    "<tr> <td><br>CU PIC</td> <td id='v3'></td>  <td id='c3'></td> <td id='s3'>N/A</td> </tr>" +
    "<tr> <td><br>CU BT</td>  <td id='v4'></td>  <td id='c4'></td> <td id='s4'>N/A</td> </tr>" +
    "<tr> <td style='padding: 20px;' colspan='4'><input style='font-size: 24px;' id='update_id' type='button' value='Update' onclick='Dld.handleDldKey()'></input> </td> </tr>" +
    "</table> </div>" +
    
    "<textarea id='textBox_id' rows='40' cols='140'>Axeda Test Log</textarea>";
    
    $('body').html(myHtml); 
                

}

// test User............................................................................................
function getUserTest()
{
    PrintLog(1, "Get User Info key pressed." );
    SendCloudAsset();
    SendCloudData( "'getUserInfoAction':'false'" );
    SendCloudData( "'getUserInfoAction':'true'" );
    uMainLoopCounter           = 0;
    bGotUserInfoRspFromCloud   = false;
    getUserInfoActionFromCloud = null;
    loopState                  = STATE_GET_USER_INFO;
    MainLoopIntervalHandle = setInterval( mainLoop, 2000 );
    
     
}


// main loop............................................................................................
function mainLoop()
{
    SendCloudPoll();
    
    switch(loopState)
    {
        case STATE_GET_USER_INFO:
        {

            if( bGotUserInfoRspFromCloud )
            {
                PrintLog(1, "Egress response: getUserInfoAction from cloud = " + getUserInfoActionFromCloud );
                clearInterval(MainLoopIntervalHandle);
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
    
    uMainLoopCounter++;
            
    if( uMainLoopCounter >= uMainLoopCounterMax )
    {
        // Clear the loop timer to stop the loop...
        clearInterval(MainLoopIntervalHandle);
        
        PrintLog(1, "Loop max reached..." );
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
        PrintLog(1, "Egress: Number of set items equals " + eg.set.length );
    
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
            else if( egStr.search("regOpForce")        != -1 )   myRegOpForceFromCloud      = eg.set[i].items.regOpForce;       // true to force
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
    
    
PrintLog(1, "Egress:  bGotUserInfoRspFromCloud=" + bGotUserInfoRspFromCloud + " getUserInfoActionFromCloud=" + getUserInfoActionFromCloud );    
PrintLog(1, "Egress:  isUpdateAvailableFromCloud=" + isUpdateAvailableFromCloud + " bGotUpdateAvailableRspFromCloud=" + bGotUpdateAvailableRspFromCloud + " bGotPackageAvailableRspFromCloud=" + bGotPackageAvailableRspFromCloud );    
    
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
            crossDomain: true,
            url        : myAssetUrl,
//            contentType: "application/json;charset=utf-8",
            contentType: "Access-Control-Allow-Headers: Content-Type",
            data       : myAsset,
            dataType   : 'json',    // response format
            success    : function(response) 
                        {
                            PrintLog( 1, "Response success: SendCloudAsset()..." + JSON.stringify(response) );
                            if( response != null )
                            {
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
            crossDomain: true,            
            url        : myDataUrl,
            contentType: "application/json;charset=utf-8",
            data       : myData,
            dataType   : 'json',    // response format
            success    : function(response) 
                        {
                            PrintLog( 1, "Response success: SendCloudData()..." + JSON.stringify(response)  );
                            if( response != null )
                            {
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
            crossDomain: true,            
            url        : myDataUrl,
            contentType: "application/json;charset=utf-8",
            data       : myData,
            dataType   : 'json',    // response format
            success    : function(response) 
                        {
                            PrintLog( 1, "Response success: SendCloudLocation()..." + JSON.stringify(response) );
                            if( response != null )
                            {
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
                            PrintLog( 1, "Response success: SendCloudEgressStatus()..." + JSON.stringify(response) );
                            if( response != null )
                            {
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
            crossDomain: true,            
            url        : myAssetUrl,
//            contentType: "application/json;charset=utf-8",
//            data       : myAsset,
            dataType   : 'json',    // response format
            success    : function(response) 
                        {
                            PrintLog( 1, "Response success: SendCloudPoll()..." + JSON.stringify(response) );
                            if( response != null )
                            {
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




// Geolocation Callbacks
// HandleConfirmLocation.......................................................................................
// process the confirmation dialog result
function HandleConfirmLocation(buttonIndex) 
{
    // buttonIndex = 0 if dialog dismissed, i.e. back button pressed.
    // buttonIndex = 1 if 'Yes' to use location information.
    // buttonIndex = 2 if 'No'
    if( buttonIndex == 1 )
    {
        // Request location...
        navigator.geolocation.getCurrentPosition(geoSuccess, geoError, {timeout:10000});

    }
}



// This method accepts a Position object, which contains the
// current GPS coordinates
//
function geoSuccess(position) 
{
    SendCloudLocation( position.coords.latitude, position.coords.longitude );
/*    
    alert('Latitude: '          + position.coords.latitude          + '\n' +
          'Longitude: '         + position.coords.longitude         + '\n' +
          'Altitude: '          + position.coords.altitude          + '\n' +
          'Accuracy: '          + position.coords.accuracy          + '\n' +
          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
          'Heading: '           + position.coords.heading           + '\n' +
          'Speed: '             + position.coords.speed             + '\n' +
          'Timestamp: '         + position.timestamp                + '\n');
*/          
}

// geoError Callback receives a PositionError object
//
function geoError(error) 
{
    // Send in the default...
    SendCloudLocation( myLat, myLong );
/* 
silent...

    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
*/          
}


// HandlePrivacyConfirmation.......................................................................................
function HandlePrivacyConfirmation(buttonIndex) 
{
    // buttonIndex = 0 if dialog dismissed, i.e. back button pressed.
    // buttonIndex = 1 if 'Ok'
    if( buttonIndex == 1 )
    {
        // Ok...
        bPrivacyViewed = true;
        
        if( isBluetoothCnx == false )
        {
            // Start the spinner..
            SpinnerStart( "Please wait", "Searching for Cel-Fi devices..." );
            UpdateStatusLine("Searching for Cel-Fi devices...");
        }
        
        // jdo:  Save to non-vol after first hit.
                
    }
}



            
            
            
function showAlert(message, title) 
{
  if(window.isPhone) 
  {
    navigator.notification.alert(message, null, title, 'ok');
  } 
  else 
  {
    alert(title ? (title + ": " + message) : message);
  }
}






// ..................................................................................
var app = {
     
    // deviceready Event Handler
    //
  	// PhoneGap is now loaded and it is now safe to make calls using PhoneGap
    //
    onDeviceReady: function() {
    
        if( ImRunningOnBrowser == false )
        {
    	   PrintLog(10,  "device ready:  Running on phone version: " + window.device.version + " parseFloat:" + parseFloat(window.device.version) );
    	}
    	
    	isNxtyStatusCurrent = false;
    	isNxtySnCurrent     = false;
    	


		// Register the event listener if the back button is pressed...
        document.addEventListener("backbutton", app.onBackKeyDown, false);
        
        app.renderHomeView();
        
        // Only start bluetooth if on a phone...
        if( window.isPhone )
        {
            
            if( window.device.platform == iOSPlatform )
            {
                if (parseFloat(window.device.version) >= 7.0) 
                {
                    StatusBar.hide();
                }
            } 
            
            StartBluetooth();
                       
        }        
    },   
       
       

    // Handle the back button
    //
    onBackKeyDown: function() 
    {
        
        if( currentView == "main" )
        {
            navigator.notification.confirm(
                        'Do you want to exit the App?',    // message
                        HandleExitApp,                     // callback to invoke with index of button pressed
                        'Exit App',                        // title
                        ['Exit', 'Cancel'] );              // buttonLabels
        }
        else if( currentView == "registration" )
        {
            reg.handleBackKey();
        }
        else if( currentView == "tech" )
        {
            tech.handleBackKey();
        }
        else if( currentView == "settings" )
        {
            Stg.handleBackKey();
        }
        else if( currentView == "download" )
        {
            Dld.handleBackKey();
        }
        else
        {
            showAlert("Back to where?", "Back...");
        }
        
    },



	// Handle the Check for SW Update key
	handleSwUpdateKey: function(id)
	{
	    // Handle if button is displayed...
	    if( document.getElementById('sw_button_id').innerHTML.length > 10 )
	    {
    	 	PrintLog(1, "SW Update key pressed");
            clearInterval(MainLoopIntervalHandle);	
     	
    	 	if( isBluetoothCnx )
    	 	{
                Dld.renderDldView();  
    	 	}
            else
            {
                if( ImRunningOnBrowser )
                {
                    // Allow the browser to go into
                    Dld.renderDldView();
                }
                else
                {       
                    showAlert("SW Update mode not allowed...", "Bluetooth not connected.");
                }
            }
            
    
    // Try various things...
    
    
    /*
    if( isRegistered )
    {
        // Unregister...
        showAlert("Just sent command to unregister...", "Unregister.");
        var u8Buff  = new Uint8Array(20);
        u8Buff[0] = 0x81;                               // Redirect to NU on entry and exit...   
        u8Buff[1] = (NXTY_PCCTRL_GLOBALFLAGS >> 24);    // Note that javascript converts var to INT32 for shift operations.
        u8Buff[2] = (NXTY_PCCTRL_GLOBALFLAGS >> 16);
        u8Buff[3] = (NXTY_PCCTRL_GLOBALFLAGS >> 8);
        u8Buff[4] = NXTY_PCCTRL_GLOBALFLAGS;
        u8Buff[5] = 0xF1;                    // Note that javascript converts var to INT32 for shift operations.
        u8Buff[6] = 0xAC;
        u8Buff[7] = 0x00;
        u8Buff[8] = 0x01;
        
        nxty.SendNxtyMsg(NXTY_CONTROL_WRITE_REQ, u8Buff, 9);
    }
    else
    {
        // Register and clear Loc Lock
        showAlert("Just sent command to register and clear loc lock...", "Register.");
        var u8Buff  = new Uint8Array(20);
        u8Buff[0] = 0x01;                               // Redirect to NU on entry...   
        u8Buff[1] = (NXTY_PCCTRL_GLOBALFLAGS >> 24);    // Note that javascript converts var to INT32 for shift operations.
        u8Buff[2] = (NXTY_PCCTRL_GLOBALFLAGS >> 16);
        u8Buff[3] = (NXTY_PCCTRL_GLOBALFLAGS >> 8);
        u8Buff[4] = NXTY_PCCTRL_GLOBALFLAGS;
        u8Buff[5] = 0xF1;                    // Note that javascript converts var to INT32 for shift operations.
        u8Buff[6] = 0xAC;
        u8Buff[7] = 0x01;
        u8Buff[8] = 0x00;
        nxty.SendNxtyMsg(NXTY_CONTROL_WRITE_REQ, u8Buff, 9);
        
        
        
        u8Buff[0] = 0x80;                               // Redirect to CU on exit...   
        u8Buff[1] = 0xF0;   // CellIdTime
        u8Buff[2] = 0x00;
        u8Buff[3] = 0x00;
        u8Buff[4] = 0x2C;
        u8Buff[5] = 0xDA;   // LOC_LOCK_RESET_VAL     
        u8Buff[6] = 0xBA;
        u8Buff[7] = 0xDA;
        u8Buff[8] = 0xBA;
        
        nxty.SendNxtyMsg(NXTY_CONTROL_WRITE_REQ, u8Buff, 9);
        
    }
    */
    
    /*
    var rsp = {set:[
        {items:{firstName:"John"},priority:0},
        {items:{lastName:"Doe"},priority:0},
        {items:{city:"San Clemente"},priority:0},
        {items:{getUserInfoAction:"true"},priority:0},
        ]} ;
    */
    
    /*
    var rsp = {packages:[
                {id:641, instructions:[{"@type":"down", id:921, fn:"WuExecutable.sec", fp:"."}],priority:0,time:1414810929705},
                {id:642, instructions:[{"@type":"down", id:922, fn:"BTFlashImg.bin", fp:"."}], priority:0,time:1414810929705}
                ],
                
              set:[
                {items:{getUserInfoAction:true},priority:0},
                {items:{firstName:"John"},priority:0},
                {items:{lastName:"Doe"},priority:0},
                {items:{addr_1:"12345 Cell Rd"},priority:0},
                {items:{addr_2:"whitefield"},priority:0},
                {items:{city:"NewYorkCity"},priority:0},
                {items:{state:"Hello"},priority:0},
                {items:{zip:"56789"},priority:0},
                {items:{SwVer_BT_CldVer:"00.04"},priority:0},
                {items:{country:"USA"},priority:0},
                {items:{phone:"1112223333"},priority:0}]};                      
    
    PrintLog( 1, "Rsp..." + JSON.stringify(rsp) );
    ProcessEgressResponse(rsp);
    */    
    
    
    
    /*
    var x  = "regOpForce:true";
    var u8 = new Uint8Array(30);
    
    for( var i = 0; i < x.length; i++ )
    {
        u8[i] = x.charCodeAt(i); 
    }
    
    nxty.SendNxtyMsg(NXTY_REGISTRATION_REQ, u8, x.length ); 
    */
            
        } // if button is displayed...            
        
	},


	// Handle the Tech Mode key
	handleTechModeKey: function()
	{
	    // Handle if button is displayed...
        if( document.getElementById('tk_button_id').innerHTML.length > 10 )
        {
    	 	PrintLog(1, "Tech Mode key pressed");
            clearInterval(MainLoopIntervalHandle); 
                	 	
    	 	if( isBluetoothCnx )
    	 	{
     	 		tech.renderTechView();
    	 	}
    	 	else
    	 	{
                if( ImRunningOnBrowser )
                {
                    // Allow the browser to go into Tech mode
                    tech.renderTechView();
                }
                else
                {	 	
    	            showAlert("Tech mode not allowed...", "Bluetooth not connected.");
    	        }
    	 	}
    	 	
        }   // if button is displayed...
	},

    // Handle the Settings key
    handleSettingsKey: function()
    {
        // Handle if button is displayed...
        if( document.getElementById('st_button_id').innerHTML.length > 10 )
        {
            PrintLog(1, "Settings key pressed");
            clearInterval(MainLoopIntervalHandle);  
           
            if( isBluetoothCnx )
            {
                Stg.renderSettingsView();
            }
            else
            {
                if( ImRunningOnBrowser )
                {
                    // Allow the browser to go into Settings mode
                    Stg.renderSettingsView();
                }
                else
                {       
                    showAlert("Settings mode not allowed...", "Bluetooth not connected.");
                }
            }
        }   // If button is displayed
    },

	// Handle the Register key
	handleRegKey: function()
	{
        // Handle if button is displayed...
        if( document.getElementById('reg_button_id').innerHTML.length > 10 )
        {
    	 	PrintLog(1, "Reg key pressed");
            clearInterval(MainLoopIntervalHandle);  
    	 	
    	 	if( isBluetoothCnx )
    	 	{
    	 	    SendCloudPoll();
    			reg.renderRegView();
    	 	}
    	 	else
    	 	{
                if( ImRunningOnBrowser )
                {
                    reg.renderRegView();
                }
                else
                {
                    showAlert("Registration mode not allowed...", "Bluetooth not connected.");
                }
    	 	}
        }   // if button is displayed
	},
	
	


	renderHomeView: function() 
	{
		var myBluetoothIcon = isBluetoothCnx ? "<div id='bt_icon_id' class='bt_icon'>" + szBtIconOn + "</div>" : "<div  id='bt_icon_id' class='bt_icon'>" + szBtIconOff + "</div>";
		var myRegIcon       = (nxtyRxRegLockStatus == 0x00) ? "<div id='reg_icon_id' class='reg_icon'></div>" : isRegistered ? "<div id='reg_icon_id' class='reg_icon'>" + szRegIconReg + "</div>" : "<div id='reg_icon_id' class='reg_icon'>" + szRegIconNotReg + "</div>";
		
		var myHtml = 
			"<img src='img/header_main.png' width='100%' />" +
			
   			myBluetoothIcon +
            myRegIcon +
   			"<button id='sw_button_id'  type='button' class='mybutton' onclick='app.handleSwUpdateKey()'></button>" +
			"<button id='tk_button_id'  type='button' class='mybutton' onclick='app.handleTechModeKey()'></button>" +
            "<button id='st_button_id'  type='button' class='mybutton' onclick='app.handleSettingsKey()'></button>" +
  			"<button id='reg_button_id' type='button' class='mybutton' onclick='app.handleRegKey()'></button>" +
  			
  			
  			szMyStatusLine;
  			

		$('body').html(myHtml); 
		
	    
	    // Make the buttons change when touched...    
 		document.getElementById("sw_button_id").addEventListener('touchstart', HandleButtonDown );
 		document.getElementById("sw_button_id").addEventListener('touchend',   HandleButtonUp );
 		
 		document.getElementById("tk_button_id").addEventListener('touchstart', HandleButtonDown );
 		document.getElementById("tk_button_id").addEventListener('touchend',   HandleButtonUp );

        document.getElementById("st_button_id").addEventListener('touchstart', HandleButtonDown );
        document.getElementById("st_button_id").addEventListener('touchend',   HandleButtonUp );
 		
 		document.getElementById("reg_button_id").addEventListener('touchstart', HandleButtonDown );
 		document.getElementById("reg_button_id").addEventListener('touchend',   HandleButtonUp );


        // Start with the buttons disabled...
        document.getElementById("sw_button_id").disabled  = true;
        document.getElementById("tk_button_id").disabled  = true;
        document.getElementById("st_button_id").disabled  = true; 
        document.getElementById("reg_button_id").disabled = true;  
		
		uMainLoopCounter = 0;

			
        // Throw the buttons up for testing... 
        if( ImRunningOnBrowser )
        {
            document.getElementById("sw_button_id").innerHTML = "<img src='img/button_SwUpdate.png' />";
            document.getElementById("tk_button_id").innerHTML = "<img src='img/button_TechMode.png' />";
            document.getElementById("st_button_id").innerHTML = "<img src='img/button_Settings.png' />"; 
            document.getElementById("reg_button_id").innerHTML = "<img src='img/button_Register.png' />";  
            
            // Enable the buttons...
            document.getElementById("sw_button_id").disabled  = false;
            document.getElementById("tk_button_id").disabled  = false;
            document.getElementById("st_button_id").disabled  = false; 
            document.getElementById("reg_button_id").disabled = false; 
        }

        
        			
        // Start the handler to be called every second...
        MainLoopIntervalHandle = setInterval(app.mainLoop, 1000 ); 

        
                
//        PrintLog(1, "Screen density: low=0.75 med=1.0 high=1.5  This screen=" +  window.devicePixelRatio );    
        
                        
        currentView = "main";
	},


	initialize: function() 
	{
		if( ImRunningOnBrowser )
		{
			PrintLog(10, "running on browser");
	
	
	        // Browser...
	        window.isPhone = false;
	        isRegistered   = false;
	        this.onDeviceReady();
	    }
	    else
	    {
		 	PrintLog(10, "running on phone");
		 	
	        // On a phone....
	        window.isPhone = true;
		 		        
	        // Call onDeviceReady when PhoneGap is loaded.
	        //
	        // At this point, the document has loaded but phonegap-1.0.0.js has not.
	        // When PhoneGap is loaded and talking with the native device,
	        // it will call the event `deviceready`.
	        // 
	        document.addEventListener('deviceready', this.onDeviceReady, false);
        }

	},




	mainLoop: function() 
	{
        var u8TempBuff = new Uint8Array(5);  
		PrintLog(4, "App: Main loop..." );
		
		if( bCheckBluetoothOnStartup )
		{
    		if( isBluetoothStarted == false )
    		{
    		  // Do nothing until bluetooth has started...
    		  return;
    		}
    		else
    		{
                // Bluetooth is not connected...see if user enabled...
                if( isBluetoothEnabled == false )
                {
                    if( uMainLoopCounter == 0 )
                    {
                        SpinnerStart( "Bluetooth Required", "Exiting App..." );
                        UpdateStatusLine( "Bluetooth Required: Exiting App..." );
                    }
                    
                    if( ++uMainLoopCounter >= 4 )
                    {
                        // Kill the app...
                        navigator.app.exitApp();
                    }
                    
                    return;
                }
                else
                {
                    // Normal flow should come here once bluetooth has been enabled...
                    bCheckBluetoothOnStartup = false;
                    
                    // Privacy policy...
                    navigator.notification.confirm(
                        'Your privacy is important to us. Please refer to www.cel-fi.com/privacypolicy for our detailed privacy policy.',    // message
                        HandlePrivacyConfirmation,      // callback to invoke with index of button pressed
                        'Privacy Policy',               // title
                        ['Ok'] );                       // buttonLabels
        
                    UpdateStatusLine("Privacy policy...");                    
                }
    		}
        }
		
		if( bPrivacyViewed == false )
		{
		  UpdateStatusLine("App sw: " + szVerApp + "  Cel-fi BT sw: " + swVerBtScan);
          PrintLog(1, "App sw ver: " + szVerApp + "  Cel-fi BT sw ver: " + swVerBtScan );
		  return;
		}
		
        if( isBluetoothCnx && (bNaking == false) )
        {
            if( isNxtyStatusCurrent == false )
            {
                if( uMainLoopCounter == 0 )
                {
                    // See if we have a network connection, i.e. WiFi or Cell.
                    isNetworkConnected = (navigator.connection.type == Connection.NONE)?false:true;
                    
                    // Start the spinner..
                    SpinnerStart( "Please wait", "Syncing data..." );
                    
                }
                
                // Get the status...returns build config which is used as model number
                nxty.SendNxtyMsg(NXTY_STATUS_REQ, null, 0);
                UpdateStatusLine("Retrieving model number...");
            } 
            else if( isNxtySnCurrent == false )
            {

                // Get the CU serial number...used by the platform 
                nxtyCurrentReq  = NXTY_SEL_PARAM_REG_SN_TYPE;
                u8TempBuff[0]   = NXTY_SW_CF_CU_TYPE;     // Select CU
                u8TempBuff[1]   = 9;                      // System SN MSD
                u8TempBuff[2]   = 8;                      // System SN LSD  
                nxty.SendNxtyMsg(NXTY_SYS_INFO_REQ, u8TempBuff, 3);
                UpdateStatusLine("Retrieving serial number...");

                bSentCloud = false;
            }
            else if( nxtySwVerNuCf == null )
            {
                UpdateStatusLine("Retrieving NU SW version...");

                if( bSentCloud == false )
                {
                    // We now have both the status and SN so notify the cloud that we are here...
                    SendCloudAsset();
                
                    navigator.notification.confirm(
                        'Provide location information?',    // message
                        HandleConfirmLocation,              // callback to invoke with index of button pressed
                        'Location',                         // title
                        ['Yes', 'No'] );                    // buttonLabels
                    

        
                    // Since this message is going to the NU, allow 3 seconds to receive the response..
                    clearInterval(MainLoopIntervalHandle);
                    MainLoopIntervalHandle = setInterval(app.mainLoop, 3000 );
                    
                    bSentCloud = true;
                }
                else
                {
                    // Since this message is going to the NU and we did not recieve it the first time, allow 6 seconds
                    // before sending again to allow the NU redirect to time out in 5..
                    clearInterval(MainLoopIntervalHandle);
                    MainLoopIntervalHandle = setInterval(app.mainLoop, 6000 );
                } 
    
                if( bUniiUp )  // up by default...
                {
                    if( (msgRxLastCmd == NXTY_NAK_RSP) && (nxtyLastNakType == NXTY_NAK_TYPE_UNIT_REDIRECT) )
                    {
                        // Bypass getting NU Sw Ver which we need for the reg info.
                        nxtySwVerNuCf = "88.88.88";
                        
                        // Cancel and wait at least 5 seconds.
                        cancelUartRedirect();
                    }
                    else
                    {
                        // Get the Cell Fi software version from the NU...
                        nxtyCurrentReq    = NXTY_SW_CF_NU_TYPE;
                        u8TempBuff[0]     = nxtyCurrentReq;
                        nxty.SendNxtyMsg(NXTY_SW_VERSION_REQ, u8TempBuff, 1);
                    }
                }
                else
                {
                    // Bypass getting NU Sw Ver which we need for the reg info.
                    nxtySwVerNuCf = "99.99.99";
                }
            }
            else if( nxtySwVerCuCf == null )
            {
                // We now have the NU SW Ver message response which has the register/lock information...
                
                // We now have the Cel-Fi SW version so send the data to the cloud
                SendCloudData( "'SwVerNU_CF':'" + SwPnNuCu + nxtySwVerNuCf + "', 'BuildId_CF':'"  + nxtySwBuildIdNu + "'" );

                // Get ready to receive user information for populating the registration info page
//                SendCloudData( "'getUserInfoAction':'false'" );


                // Crank it up since we are no longer talking to the NU...
                clearInterval(MainLoopIntervalHandle);
                MainLoopIntervalHandle = setInterval(app.mainLoop, 1000 );
                            
            
                // Get the CU software version...
                nxtyCurrentReq    = NXTY_SW_CF_CU_TYPE;
                u8TempBuff[0]     = nxtyCurrentReq;
                nxty.SendNxtyMsg(NXTY_SW_VERSION_REQ, u8TempBuff, 1);                
                UpdateStatusLine("Retrieving CU SW version...");
            }            
            else if( nxtySwVerCuPic == null )
            {
            
                // We now have the CU SW version so send the data to the cloud
                SendCloudData( "'SwVerCU_CF':'" + SwPnNuCu + nxtySwVerCuCf + "'" );
                    
                // Request user information...
                bGotUserInfoRspFromCloud = true;                        // jdo: 1/22/15:  No longer want to prefill data.
//                SendCloudData( "'getUserInfoAction':'true'" );
                                    
                // Get the CU PIC software version...
                nxtyCurrentReq    = NXTY_SW_CU_PIC_TYPE;
                u8TempBuff[0]     = nxtyCurrentReq;
                nxty.SendNxtyMsg(NXTY_SW_VERSION_REQ, u8TempBuff, 1);                
                UpdateStatusLine("Retrieving CU PIC SW version...");
            }
            else if( nxtySwVerNuPic == null )
            {
                // We now have the CU PIC SW version so send the data to the cloud
                SendCloudData( "'SwVerCU_PIC':'" + SwPnPic + nxtySwVerCuPic + "'" );
                            
                // Get the NU PIC software version...
                nxtyCurrentReq    = NXTY_SW_NU_PIC_TYPE;
                u8TempBuff[0]     = nxtyCurrentReq;
                nxty.SendNxtyMsg(NXTY_SW_VERSION_REQ, u8TempBuff, 1);   
                UpdateStatusLine("Retrieving NU PIC SW version...");                             
            }
            else if( nxtySwVerBt == null )
            {
                // We now have the NU PIC SW version so send the data to the cloud
                SendCloudData( "'SwVerNU_PIC':'" + SwPnPic + nxtySwVerNuPic + "'" );
                            
                // Get the BT software version...
                nxtyCurrentReq    = NXTY_SW_BT_TYPE;
                u8TempBuff[0]     = nxtyCurrentReq;
                nxty.SendNxtyMsg(NXTY_SW_VERSION_REQ, u8TempBuff, 1);                
                UpdateStatusLine("Retrieving Bluetooth SW version...");                             
            }
            else if( nxtyUniqueId == null )
            {
                // We now have the BT SW version so send the data to the cloud
                SendCloudData( "'SwVer_BT':'" + SwPnBt + nxtySwVerBt + "', 'OperatorCode':'" + myOperatorCode + "'"  );

                                
                // Get the Unique ID...
                nxtyCurrentReq  = NXTY_SEL_PARAM_REG_UID_TYPE;
                u8TempBuff[0]   = NXTY_SW_CF_CU_TYPE;
                u8TempBuff[1]   = 2;                      // Unique ID MSD
                u8TempBuff[2]   = 1;                      // Unique ID LSD  
                nxty.SendNxtyMsg(NXTY_SYS_INFO_REQ, u8TempBuff, 3);
    
                uMainLoopCounter = 0;
                
                
                // Set the isRegistered var temporarily to determine if we need to poll for cloud data or not...
                if( (nxtyRxRegLockStatus == 0x0B) || (nxtyRxRegLockStatus == 0x07) ||       // State 8 (0x0B) or 12 (0x07)
                    (nxtyRxRegLockStatus == 0x08) || (nxtyRxRegLockStatus == 0x09) ||       // State 5 (0x08) or 6  (0x09)
                    (nxtyRxRegLockStatus == 0x04) || (nxtyRxRegLockStatus == 0x05) )        // State 9 (0x04) or 10 (0x05)
                {
                    // Not registered.
                    isRegistered = false;
                }
                else if( nxtyRxRegLockStatus & 0x02 )
                {
                    isRegistered = true;    
                }
                
                                        
            }
            else if( (isRegistered == false) && (bGotUserInfoRspFromCloud == false) && (uMainLoopCounter < (MAIN_LOOP_COUNTER_MAX - 2)) )
            {
                // Only need to stay here and try to get the user's lastName/firstName etc. data from the cloud if we are not registered or are regegistering.
                SendCloudPoll();
                UpdateStatusLine("Syncing User Info from platform ... " + uMainLoopCounter); 
            }
            else 
            {
                if( msgRxLastCmd == NXTY_SYS_INFO_RSP )
                {
                    // We we just received the Unique ID send the data to the cloud
                    SendCloudData( "'UniqueId':'" + nxtyUniqueId + "'" );
                }
                

                // Clear the loop timer to stop the loop...
                clearInterval(MainLoopIntervalHandle);
                SpinnerStop();
                uMainLoopCounter = 0;
                    
                if( bUniiUp == false )
                {   
                    var eText = "Wireless link between Cel-Fi units is not working.  Registration status unknown.";
                    UpdateStatusLine( eText );            
                    navigator.notification.confirm(
                        eText,    // message
                        HandleUniiRetry,                    // callback to invoke with index of button pressed
                        'UNII Link Down',                   // title
                        ['Retry', 'End'] );                 // buttonLabels                                     
                }
                else if( isNetworkConnected == false )
                {
                    var eText = "Unable to connect to cloud, no WiFi or Cell available.";
                    showAlert( eText, "Network Status.");
                    UpdateStatusLine( eText );
                    navigator.notification.confirm(
                        eText,    // message
                        HandleCloudRetry,                    // callback to invoke with index of button pressed
                        'No WiFi or Cell',                   // title
                        ['Retry', 'End'] );                 // buttonLabels                                     
                                                 
                }
                else if( nxtyRxRegLockStatus == 0x01 )     // State 2:  Only Loc Lock bit set.
                {
                    var eText = "Please call your service provider. (Reg State 2)";
                    showAlert( eText, "Location Lock Set.");
                    UpdateStatusLine( eText );                             
                }  
                else
                {
                    // No critical alerts so post the buttons....
                    document.getElementById("sw_button_id").innerHTML = "<img src='img/button_SwUpdate.png' />";
                    document.getElementById("tk_button_id").innerHTML = "<img src='img/button_TechMode.png' />";
                    document.getElementById("st_button_id").innerHTML = "<img src='img/button_Settings.png' />";
                    
                    
                    // Enable the buttons...
                    document.getElementById("sw_button_id").disabled  = false;
                    document.getElementById("tk_button_id").disabled  = false;
                    document.getElementById("st_button_id").disabled  = false; 


                    UpdateStatusLine( "Select button...<br>Connected to: " + myModel + ":" + mySn );                             

                    if( (nxtyRxRegLockStatus == 0x0B) || (nxtyRxRegLockStatus == 0x07) )     // State 8 (0x0B) or 12 (0x07)
                    {
                        UpdateRegButton(0);     // Add the reg button.
                        UpdateRegIcon(0);       // Set reg ICON to not registered...
                        showAlert("Please re-register your device by selecting the register button.", "Registration Required.");
                    }                            
                    else if( (nxtyRxRegLockStatus == 0x08) || (nxtyRxRegLockStatus == 0x09) ||    // State 5 (0x08) or 6  (0x09)
                             (nxtyRxRegLockStatus == 0x04) || (nxtyRxRegLockStatus == 0x05) )     // State 9 (0x04) or 10 (0x05)
                    {
                        UpdateRegButton(0);     // Add the reg button.
                        UpdateRegIcon(0);       // Set reg ICON to not registered...
                        showAlert("Please register your device by selecting the register button.", "Registration Required.");
                    }
                    else
                    {
                        if( nxtyRxRegLockStatus & 0x02 )
                        {
                            UpdateRegIcon(1);       // Set reg ICON to Registered...
                        }
                        
                    }
                                                            
                    
                    // Look at the registered status to update the cloud.   Must wait until after the nxtyRxRegLockStatus check above
                    // so the logic will update the isRegistered variable.
                    if( isRegistered )
                    {
                        SendCloudData( "'Registered':" + 1 );
                    }
                    else
                    {
                        SendCloudData( "'Registered':" + 0 );
                    }
                
                } 
            }  // End of else
            


            
          
            uMainLoopCounter++;
            
            if( uMainLoopCounter > MAIN_LOOP_COUNTER_MAX )
            {
                // Clear the loop timer to stop the loop...
                clearInterval(MainLoopIntervalHandle);
                SpinnerStop();
                showAlert("Unable to sync data...", "Timeout");
                UpdateStatusLine( "Timeout: Unable to sync data..." );
            }

        }   // End if( isBluetoothCnx )

		
	}, // End of MainLoop()



};






	
