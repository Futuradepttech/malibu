	//var BASE_URL="http://10.11.12.224/workshop/event_planner/app/";
	//var BASE_URL = "http://182.71.22.42/hst/malibu/app/";
	//var BASE_URL = "http://52.26.254.149/malibu/app/";
	var BASE_URL = "http://futuradept.com/malibu/";
	var videosrc = "";
	var camera_use = false;
	var myeditcanvas;
	var img_to_show, img_to_show1;
	var img_temp_id;
	var img_to_show_type;
	var dashboard_id = 0;
	var view_profile_id = 0;
	var tags=[];
	var current_lat = "0.0";
	var current_lng = "0.0";
	//MY_user_data
	var user_id = 0;
	//page data
	var lastpage = '';
	var currentpage = '';
	var cap_to_show='';
	var new_img_vid=0;

	var galleryFlag;
	
	//For CHat
	var conversation_id='';
	var for_chat_user_id='';
	var for_chat_user_name='';
	var for_chat_user_pic='';
	var push_id='';
	var to_view_profile='';
	var show_all_msg='0';
	var show_cmtss='';

var user_id = localStorage.getItem('userid');

//alert(user_id)

var lan_code = {"english":[{"login":"Login",
                           "register":"Register",
                           "Forgot_username":"Forgot Password/Username?",
                           "profile":"Profile",
                           "email":"Email",
                           "name":"Name",
                           "city":"City",
                           "sex":"Sex",
                           "dob":"Dob",
                           "friends":"Friends",
                           "post":"Posts",
                           "acinfo":"Account Info",
                           "editprof":"Edit Profile",
                           "change_pass":"Change Password",
                           "report":"Report",
                           "terms_cond":"Terms and Condition",
                           "policy":"Privacy Policy",
                           "lan_engl":"Change Language (English)",
                           "lan_span":"Change Language (Spanish)",
                           "signout":"Sign Out",
                           "updatebtn":" Update",
                           "notiftext":"Notification",
                           "selfietext":"Selfies",
                           "searchtext":"Search",
                           "btn_alltext":"All",
                           "btn_phototext":"Photo",
                           "btn_videotext":"Video",
                           "dashboardtext":"Dashboard",
                           "btn_private_text":"Private",
                           "btn_public_text":"Public",
                           "home":"Home"

                           }],
    
                "spanish":[{"login":"iniciar sesión",
                           "register":"registro",
                           "Forgot_username":"Olvidaste tu nombre de usuario o contraseña",
                           "profile":"perfil",
                           "email":"Email",
                           "name":"Nombre",
                           "city":"Ciudad",
                           "sex":"Sexo",
                           "dob":"Fecha de nacimiento",
                           "friends":"amigos",
                           "post":"Publicaciones",
                           "acinfo":"Informacion de cuenta",
                           "editprof":"Editar perfil",
                           "change_pass":"Cambia la contraseña",
                           "report":"informe",
                           "terms_cond":"términos y Condiciones",
                           "policy":"política de privacidad",
                           "lan_engl":"Cambiar idioma (inglés)",
                           "lan_span":"Cambiar idioma (Español)",
                           "signout":"Desconectar",
                           "updateprof":"Actualización del perfil",
                           "updatebtn": "Actualización",
                           "notiftext":"Notificación",
                           "selfietext":"Selfies",
                           "searchtext":"Buscar",
                           "btn_alltext":"Todas",
                           "btn_phototext":"Foto",
                           "btn_videotext":"Vídeo",
                           "dashboardtext":"Tablero",
                           "btn_private_text":"Privado",
                           "btn_public_text":"Público",
                           "home":"Casa"

                           }
                           
                           ]}





	/*
	To set space for top status bar in IOS 
	when device camera and gallery is used
	*/
	
	function mytopmargin() {
		console.log("PLAT>>>" + device.platform);
		show_all_msg='0';
		if (camera_use && device.platform === 'iOS') {
			$("div[data-role='header']").css("padding-top", "21px");
			$("div[data-role='main']").css("padding-top", "21px");
			//			$("div[data-role='header']").find('h3').css("margin-top","21px");
		} else {
			console.log("android");
		}
	}
	
	function dateFromString(str) {
		  var a = $.map(str.split(/[^0-9]/), function(s) { return parseInt(s, 10) });
		  return new Date(a[0], a[1]-1 || 0, a[2] || 1, a[3] || 0, a[4] || 0, a[5] || 0, a[6] || 0);
	}
	
	function alertSS(msg2){
         if(msg2 != "Server Error"){
		if(device.platform === 'Android'){
					navigator.notification.alert(
						    msg2,  // message
						    null,         // callback
						    'MalibuSelfies',            // title
						    'OK'                  // buttonName
						);	
		}else{
			navigator.notification.confirm(
					   msg2,
					    callBackFunction, // Specify a function to be called 
					    'MalibuSelfies',
					    ["Ok", "Cancel"]
					);

					function callBackFunction(b){
					  if(b == 1){
					    console.log("user said ok");
					  }
					  else {
					    console.log("user said Awesome");
					  }
					}
		}
         }
	}
	
	/*
	Loading with message
	*/
	function loading() {
		$("body").addClass('ui-disabled');
		$.mobile.loading('show',{
			text : "uploading",
			textVisible : true,
			textonly : false,
			html : "<span class='ui-bar ui-shadow ui-overlay-d ui-corner-all' style='background-color:transparent;'><div align='center'><img src='img/loader.gif' /><br/><h2 style='color:#000000; font-size:16px;text-transform:none;'>Loading...</h2></div></span>"
		});
	}
	/*
	Done Loading with message
	*/
	function loading_done() {
		$.mobile.loading('hide');
		$("body").removeClass('ui-disabled');
	}

	$(function() {
		document.addEventListener("deviceready", ready, false);

		
		
		
		function ready() {
			navigator.splashscreen.show();
			
			if (device.platform === 'iOS' && parseFloat(device.version) > 6.0) {
				navigator.splashscreen.hide();

			} else {
				console.log('els');
			}
				//$.mobile.changePage("add_taload_datag_friends.html", {
				//	changeHash : true
				//});
		
			
			
			//initPushwoosh();
			
			
			
			/*
			Check user is already logged in
			*/
			console.log("MYLOGIN DEVICEID>"+device.uuid);	
		/*
			loading();
			$.ajax({
				url : BASE_URL + 'api/app/device_login',
				dataType : 'json',
				type : 'post',
				contentType : 'application/x-www-form-urlencoded',
				data : {
					device_id : device.uuid
				},
				success : function(data, textStatus, jQxhr) {
					//console.log(JSON.stringify(data));
					loading_done();
					if (data.status == '1') {
						user_id = data.data.id;
						$.mobile.changePage("profile.html", {
							changeHash : true
						});
					} else {
						//alert(data.data);
					}
				},
				error : function(jqXhr, textStatus, errorThrown) {
					console.log(errorThrown);
					loading_done();
					alertSS('Server Error');
				}
			});
		*/
      
      
      
      
      
			
			//document.addEventListener("backbutton",back,false);
		}
		
		/*
			Back button for Android
		*/
		function back() {
			console.log("sadashd");
			if(device.platform === 'Android'){
				navigator.notification.confirm(
						   'Are you sure to exit?',
						    callBackFunction, // Specify a function to be called 
						    'MalibuSelfies',
						    ["Ok", "Cancel"]
						);

						function callBackFunction(b){
						  if(b == 1){
							  navigator.app.exitApp();
						  }
						  else {
						    console.log("user said Awesome");
						  }
						}
			}
		}

	
      
      

		/*
		To show all post and post by the user and its followers
		*/
		
		$(document).on("pageshow","#dashboard",function() {
			mytopmargin();
                       
                       //Ashutosh mishra11
                       var set_lang = localStorage.getItem('lang_select');
                       if(set_lang == "en_en"){
                       $("#dashboard_text").html(lan_code.english[0].dashboardtext);
                       $("#btn_public").html(lan_code.english[0].btn_public_text);
                       $("#btn_private").html(lan_code.english[0].btn_private_text);

                       }else{
                       $("#dashboard_text").html(lan_code.spanish[0].dashboardtext);
                       $("#btn_public").html(lan_code.spanish[0].btn_public_text);
                       $("#btn_private").html(lan_code.spanish[0].btn_private_text);

                       }

                       
			//initial Display
			var pp="public";
			var load_val = 0;
			var full_data;
			document.addEventListener("backbutton",back,false);
			function initial() {
				$('#btn_public').css({'background-color' : '#00BEE9','color' : '#FFFFFF'});
				$('#btn_private').css({'background-color' : '#F2F2F2','color' : '#434343'});
				$('#public').css({'display' : ''});
				$('#private').css({'display' : 'none'});
				pp = "public";
				load_data()
			}
			initial();

			//2 bar clicks

			$('#btn_public').click(function() {
				$('#btn_public').css({'background-color' : '#00BEE9','color' : '#FFFFFF'});
				$('#btn_private').css({'background-color' : '#F2F2F2','color' : '#434343'});
				$('#public').css({'display' : ''});
				$('#private').css({'display' : 'none'});
				pp = "public";
				load_data()
			});

			$('#btn_private').click(function() {
				$('#btn_private').css({'background-color' : '#00BEE9','color' : '#FFFFFF'});
				$('#btn_public').css({'background-color' : '#F2F2F2','color' : '#434343'});
				$('#private').css({'display' : ''});
				$('#public').css({'display' : 'none'});
				pp = "private";
				load_data();
			});

			function load_data() {
				//loading();
				$.ajax({
						url : BASE_URL+ 'home.php',
						dataType : 'json',
						type : 'post',
						contentType : 'application/x-www-form-urlencoded',
						data : {userid : user_id,type : pp},
						success : function(data,textStatus, jQxhr) {
								console.log(JSON.stringify(data));
								loading_done();
								if (data.post_data.length > 0) {
									$('#dashboard_list').empty();
													//dashboard_data(data.data);
									full_data = data.post_data;
									console.log("LENGTH>"+ full_data.length);
									$('#noti_count').css('display','');
//                                    if(data.notification.unread==0){
//                                        $('#noti_count').css('display','none');
//                                    }else if(data.notification.unread > 7){
//                                        $('#noti_count').text('7+');
//                                    }else{
//                                        $('#noti_count').text(data.notification.unread);
//                                    }
									load_more(load_val,full_data);
								} else {
									alertSS(data.data);
								}
							},
							error : function(jqXhr, textStatus,errorThrown) {
									console.log(errorThrown);
									loading_done();
									alertSS('Server Error');
							}
						});
					}

					function load_more(val, data) {
						var max = val + 10;
						console.log("DATA Value >>>> "+JSON.stringify(data));
						//alert(data.length);
						  if(data.length > 0 ) {
										for ( var i = val; i < data.length; i++) {
											var url = "";
											var post = "";
											var mmg = "";
//                                            if (data[i].post_data.profile_pic == '') {
//                                                mmg = "img/suer_profile.png";
//                                            } else {
//                                                mmg = BASE_URL
//                                                        + data[i].post_data.profile_pic;
//                                            }
                       
                       mmg = "img/suer_profile.png";
											if (data[i].type == "image") {
												url = BASE_URL
														+ data[i].file_name;
                       var encodeuri = btoa(url);
												post = ("<li data-value='"
														+ data[i].id
														+ "' style='background-color: transparent; color: #303638; text-transform: none; overflow: auto; padding: 5px; -webkit-transform: translateZ(0);' ><div class='ui-grid-a'><div class='ui-block-a' style='width: 15%;'><img src='"+mmg+"' id='showpic' data-value='"+ data[i].user_id+ "' style='height: 45px; width: 45px; border-radius: 23px;'></div><div class='ui-block-b' style='width: 65%; padding-top: 15px;'><label id='showname' data-value='"+ data[i].user_id+ "' style='font-size: medium; margin-left: 10px; color: #525456; text-shadow: none; text-transform: none; font-weight: bold;'>"
														+ data[i].name
														+ "</label></div></div> <img id='imgsss' data-value='"+ data[i].id+ "' class='img_"+data[i].id+"' src='"
														+ url
                                                        + "'style='width: 100%; background-size: cover; margin-top: 18px;'><div class='ui-grid-c' style='width: 50%; margin-top: 10px; height: 30px;margin-left:7px;'><img class='ui-block-a' src='img/ic_heart_icon.png' id='like1' data-value='"+data[i].id+"' style='width: 20px; height: 20px;'> <label id='like2' data-value='"+data[i].id+"' class='ui-block-b' style='color: #525456; text-transform: none; text-shadow: none; font-size: small; font-weight: bold; margin-left: 5px; padding-top: 3px;'>");
//                                                        + data[i].likes_data.total_likes + "</label><div id='cmtss' data-value='"+ data[i].post_data.id+ "'><img class='ui-block-c' src='img/ic_comment.png' style='width: 20px; height: 20px; margin-left: 5px;'><label class='ui-block-d' style='color: #525456; text-transform: none; text-shadow: none; font-size: small; font-weight: bold; margin-left: 5px; padding-top: 3px;'>Comments</label></div></div>");
											} else {
													
											//alert(12)
												url = BASE_URL
														+ (data[i].file_name
																.replace('.mp4',
																		'.jpg'));
												post = ("<li data-value='"
														+ data[i].id
														+ "' style='background-color: transparent; color: #303638; text-transform: none; overflow: auto; padding: 5px; -webkit-transform: translateZ(0);' ><div class='ui-grid-b'><div class='ui-block-a' style='width: 15%;'><img src='"+mmg+"' id='showpic' data-value='"+ data[i].user_id+ "' style='height: 45px; width: 45px; border-radius: 23px;'></div><div class='ui-block-b' style='width: 65%; padding-top: 15px;'><label id='showname' data-value='"+ data[i].user_id+ "' style='font-size: medium; margin-left: 10px; color: #525456; text-shadow: none; text-transform: none; font-weight: bold;'>"
														+ data[i].name
														+ "</label></div><img id='deleteimg' data-value='"+data[i].id+"' class='ui-block-c' style='width:12.4%;float:right;' src='img/viewData.png'></div> <div>"
                                                        +"<video style='margin-top: 18px;' width='100%' height='100%' controls> <source src='"
														+ BASE_URL+data[i].file_name
                                                        + "'type='video/mp4'></video>"
                                                        +"<span style='position:absolute;left:0;top:0;right:0;bottom:0;z-index:1;display:none;background: url(img/ic_video_up.png) no-repeat center center;'></div><div class='ui-grid-c' style='width: 50%; margin-top: 7px; height: 30px;margin-left:12px;'><img class='ui-block-a' src='img/ic_heart_icon.png' id='like1' data-value='"+data[i].id+"' style='width: 20px; height: 20px;'> <label id='like2' data-value='"+data[i].id+"' class='ui-block-b' style='color: #525456; text-transform: none; text-shadow: none; font-size: small; font-weight: bold; margin-left: 5px; padding-top: 3px;'>");
//                                                        + data[i].likes_data.total_likes + "</label><div id='cmtss' data-value='"+ data[i].post_data.id+ "'><img class='ui-block-c' src='img/ic_comment.png' style='width: 20px; height: 20px; margin-left: 5px;'><label class='ui-block-d' style='color: #525456; text-transform: none; text-shadow: none; font-size: small; font-weight: bold; margin-left: 5px; padding-top: 3px;'>Comments</label></div></div>");
											}

											var comments = "";
//
											var total_comments = "<div style='color: #525456; float: left; margin-left: 10%; margin-top: 10px;'	id='cmtcount' data-value='"
													+ data[i].id
													+ "'><label style='font-size: 80%;'>view all "
													//+ data[i].comments_data.total_comments
													+ " comments</label>	</div></li>";
											var line='<div data-role="none" style="width:100%;height:1px;background:#A9AAAB;margin-top:7px;margin-bottom:7px;"></div>';
											$('#dashboard_list').append(
													post + comments
															+ total_comments);
//                                            for ( var j = 0; j < data[i].likes_data.data.length; j++) {
//                                                console
//                                                        .log(data[i].likes_data.data[j].user_id);
//                                                if (data[i].likes_data.data[j].user_id == user_id) {
//                                                    $('#dashboard_list li')
//                                                            .find(
//                                                                    'img[data-value="'
//                                                                            + data[i].post_data.id
//                                                                            + '"]')
//                                                            .attr('src',
//                                                                    'img/ic_heart_icon_clk.png');
//                                                    break;
//                                                }
//                                            }
										}
										var not_click = false;
                       

                       
                       
										$('#dashboard_list li #loadmoredash')
												.click(function() {
													console.log("LOADMORE>" + max);
													not_click = true;
													$(this).remove();
													load_more(max, data);
												});

										$('#dashboard_list li #showpic').click(function(){
											not_click = true;
											console.log("CCPIC"+ $(this).attr('data-value'));
											view_profile_id = $(this).attr('data-value');
											$.mobile.changePage("view_user.html", {changeHash : true});
										});
										
										$('#dashboard_list li #showname').click(function(){
											not_click = true;
											console.log("CCNAME"+ $(this).attr('data-value'));
											view_profile_id = $(this).attr('data-value');
											$.mobile.changePage("view_user.html", {changeHash : true});
										});
										
										$('#dashboard_list li #cmtss').click(function(){
											not_click = true;
											console.log("CCNAME"+ $(this).attr('data-value'));
											dashboard_id = $(this).attr('data-value');
											$.mobile.changePage("comments.html", {changeHash : true});
										});
										
										$('#dashboard_list li #imgsss').click(function(){
											not_click = true;
											console.log("CCNAME"+ $(this).attr('data-value'));
                                            dashboard_id = $(this).attr('data-value');
                                            //var img_url = $('.img_'+dashboard_id+'').attr('src');
                                           // window.open(encodeURI(img_url), '_blank', 'location=yes');
                                          if (typeof dashboard_id != 'undefined') {
                                          $.mobile.changePage("data_view.html",{changeHash : true});
                                          }
										});
										
										$('#dashboard_list li #deleteimg').click(function(){
											not_click = true;
											console.log("CCNAME"+ $(this).attr('data-value'));
											dashboard_id = $(this).attr('data-value');
											if (typeof dashboard_id != 'undefined') {
												$.mobile.changePage("data_view.html",{changeHash : true});
											}
											//window.open(encodeURI(BASE_URL+"video/view/"+dashboard_id+'/type/fb'), '_blank', 'location=no');
										});
										
										//	if(val==0){
										$('#dashboard_list li').click(function() {
												if (!not_click) {
//													dashboard_id = $(this).attr('data-value');
//													if (typeof dashboard_id != 'undefined') {
//														$.mobile.changePage("data_view.html",{changeHash : true});
//													}
												}
												not_click = false;
										});

										$('#dashboard_list li #nameC').click(function() {
											not_click = true;
											view_profile_id = $(this).attr('data-value');
											$.mobile.changePage("view_user.html", {changeHash : true});
										});
										$('#dashboard_list li #cmtcount').click(function() {
											not_click = true;
											dashboard_id = $(this).attr('data-value');
											$.mobile.changePage("data_view.html", {changeHash : true});
										});
										$('#dashboard_list li #deleteimg1').click(function(){
											not_click = true;
											var cc=$(this).attr('data-value');
											console.log(cc);
											$.ajax({
												url : BASE_URL
														+ 'api/app/delete_user',
												dataType : 'json',
												type : 'post',
												contentType : 'application/x-www-form-urlencoded',
												data : {
													user_id : user_id,
													post_id : cc
												},
												success : function(
														data,
														textStatus,
														jQxhr) {
													console.log(JSON.stringify(data));
													if (data.status == '1') {
															alertSS("Deleted Successfully");
															if (dvt.prevPage.attr('id') != "add_details") {
															
															}else{
																$.mobile.changePage("dashboard.html",
																{
																	changeHash : true
																});	
															}
													} else {
														console
																.log(data.data);
													}
												},
												error : function(
														jqXhr,
														textStatus,
														errorThrown) {
													console
															.log(errorThrown);
													alertSS('Server Error');
												}
											});
										});
										
										$('#dashboard_list li #like1')
												.click(
														function() {
															not_click = true;
															
															var vll = $(this).attr(
																	'data-value');
															var lk = parseInt($('#dashboard_list li').find('label[data-value="'+ vll+ '"]').text());
															console.log("as>" + lk);

															if ($(this).attr('src') == 'img/ic_heart_icon.png') {
																$(this).attr('src','img/ic_heart_icon_clk.png');
																$('#dashboard_list li').find('label[data-value="'+ vll+ '"]').text(lk + 1);
																//loading();
																$.ajax({
																		url : BASE_URL+ 'api/app/add_like',
																		dataType : 'json',
																		type : 'post',
																		contentType : 'application/x-www-form-urlencoded',
																		data : {
																				user_id : user_id,
																				post_id : $(this).attr('data-value')
																		},
																		success : function(
																					data,
																					textStatus,
																					jQxhr) {
																				//console.log(JSON.stringify(data));
																				if (data.status == '1No More') {

																				} else {
																					console
																							.log(data.data);
																				}
																				//	loading_done();
																		},
																		error : function(
																					jqXhr,
																					textStatus,
																					errorThrown) {
																				console
																						.log(errorThrown);
																				alertSS('Server Error');
																				//	loading_done();
																		}
																});
															} else {
																$(this).attr('src','img/ic_heart_icon.png');
																$('#dashboard_list li').find('label[data-value="'+ vll+ '"]').text(lk - 1);
																//loading();
																$.ajax({
																			url : BASE_URL
																					+ 'api/app/remove_like',
																			dataType : 'json',
																			type : 'post',
																			contentType : 'application/x-www-form-urlencoded',
																			data : {
																				user_id : user_id,
																				post_id : $(
																						this)
																						.attr(
																								'data-value')
																			},
																			success : function(
																					data,
																					textStatus,
																					jQxhr) {
																				//console.log(JSON.stringify(data));
																				if (data.status == '1') {

																				} else {
																					console
																							.log(data.data);
																				}
																				//		loading_done();
																			},
																			error : function(
																					jqXhr,
																					textStatus,
																					errorThrown) {
																				console
																						.log(errorThrown);
																				alertSS('Server Error');
																				//	loading_done();
																			}
																		});
															}
														});

										/*		$('#dashboard_list li #like2').click(function(){
													console.log("LK2"+$(this).attr('data-value'));
													var lk = parseInt($(this).text());
													console.log("as>"+lk);
													$(this).text(lk+1);
													$.ajax({
										         		url: BASE_URL+'api/app/add_like',
										         		dataType: 'json',
										         		type: 'post',
										         		contentType: 'application/x-www-form-urlencoded',
										         		data: {user_id: user_id,post_id: $(this).attr('data-value')},
										         		success: function( data, textStatus, jQxhr ){
										         			//console.log(JSON.stringify(data));
										         				if(data.status=='1'){
										         					
										         				}else{
										         					console.log(data.data);
										         				}
										         		},
										         		error: function( jqXhr, textStatus, errorThrown ){
										             		console.log( errorThrown );
										             		alert('Server Error');
										         		}
										     		});
												});
										 */
										//	}
								// }
								
                       }else {
									alertSS('No More Data');
								} 
							}


                       
                       
							function dashboard_data(data) {
								$('#dashboard_list').empty();
								for ( var i = 0; i < data.length; i++) {
									var url = "";
									var post = "";
									var mmg = "";
									if (data[i].post_data.profile_pic == '') {
										mmg = "img/suer_profile.png";
									} else {
										mmg = BASE_URL
												+ data[i].post_data.profile_pic;
									}

									if (data[i].post_data.type == "image") {
										url = BASE_URL
												+ data[i].post_data.file_name;
										post = ("<li data-value='"
												+ data[i].post_data.id
												+ "' style='background-color: transparent; color: #303638; text-transform: none; overflow: auto; padding: 5px; -webkit-transform: translateZ(0);' ><div class='ui-grid-a'><div class='ui-block-a' style='width: 15%;'><img src='"+mmg+"' style='height: 45px; width: 45px; border-radius: 23px;'></div><div class='ui-block-b' style='width: 85%; padding-top: 15px;'><label style='font-size: medium; margin-left: 10px; color: #696969; text-shadow: none; text-transform: none; font-weight: bold;'>"
												+ data[i].post_data.name
												+ "</label></div></div> <img src='"
												+ url
												+ "'style='width: 100%; background-size: cover; margin-top: 15px;'><div class='ui-grid-c' style='width: 50%; margin-top: 10px; height: 30px;'><img class='ui-block-a' src='img/ic_heart_icon.png' id='like1' data-value='"+data[i].post_data.id+"' style='width: 20px; height: 20px;'> <label id='like2' data-value='"+data[i].post_data.id+"' class='ui-block-b' style='color: #626262; text-transform: none; text-shadow: none; font-size: small; font-weight: bold; margin-left: 5px; padding-top: 3px;'>"
												+ data[i].likes_data.total_likes + "</label><img class='ui-block-c' src='img/ic_comment.png' style='width: 20px; height: 20px; margin-left: 5px;'><label class='ui-block-d' style='color: #626262; text-transform: none; text-shadow: none; font-size: small; font-weight: bold; margin-left: 5px; padding-top: 3px;'>Comments</label></div>");
									} else {
										url = BASE_URL
												+ (data[i].post_data.file_name
														.replace('.mp4', '.jpg'));
										post = ("<li data-value='"
												+ data[i].post_data.id
												+ "' style='background-color: transparent; color: #303638; text-transform: none; overflow: auto; padding: 5px; -webkit-transform: translateZ(0);' ><div class='ui-grid-a'><div class='ui-block-a' style='width: 15%;'><img src='"+mmg+"' style='height: 45px; width: 45px; border-radius: 23px;'></div><div class='ui-block-b' style='width: 85%; padding-top: 15px;'><label style='font-size: medium; margin-left: 10px; color: #696969; text-shadow: none; text-transform: none; font-weight: bold;'>"
												+ data[i].post_data.name
												+ "</label></div></div> <div><img src='"
												+ url
												+ "'style='width: 100%; background-size: cover; margin-top: 15px;'><span style='position:absolute;left:0;top:0;right:0;bottom:0;z-index:1;display:none;background: url(img/ic_video_up.png) no-repeat center center;'></div><div class='ui-grid-c' style='width: 50%; margin-top: 10px; height: 30px;'><img class='ui-block-a' src='img/ic_heart_icon.png' id='like1' data-value='"+data[i].post_data.id+"' style='width: 20px; height: 20px;'> <label id='like2' data-value='"+data[i].post_data.id+"' class='ui-block-b' style='color: #626262; text-transform: none; text-shadow: none; font-size: small; font-weight: bold; margin-left: 5px; padding-top: 3px;'>"
												+ data[i].likes_data.total_likes + "</label><img class='ui-block-c' src='img/ic_comment.png' style='width: 20px; height: 20px; margin-left: 5px;'><label class='ui-block-d' style='color: #626262; text-transform: none; text-shadow: none; font-size: small; font-weight: bold; margin-left: 5px; padding-top: 3px;'>Comments</label></div>");
									}

									var comments = "";
									if (data[i].comments_data.data.length >= 5) {
										for ( var j = 0; j < 5; j++) {
											var bb = "";
											if (data[i].comments_data.data[j].profile_pic == "") {
												bb = "img/suer_profile.png";
											} else {
												bb = BASE_URL
														+ data[i].comments_data.data[j].profile_pic;
											}
											comments += ("<div class='ui-grid-a'	style='width: 100%; float: left; margin-top: 1%;'>	<div class='ui-block-a'	style='width: 10%; height: 25px; float: left;'>	<img src='"+bb+"' height='25px' width='25px' style='border-radius: 50px;'>	</div>	<div class='ui-block-b' style='width: 90%;'><div style='float: left;width: 90%;'><label id='nameC' data-value='"+data[i].comments_data.data[j].user_id+"' style='font-size: small; color: #000000; font-weight: normal;'>"
													+ data[i].comments_data.data[j].name
													+ "</label></div><div style='width: 90%; padding-left: 1%;'><div style='width: 95%; white-space: normal;'>	<label	style='word-wrap: break-word; font-size: 70%; margin-top: 0px;'>"
													+ data[i].comments_data.data[j].comment + "</label></div></div></div></div>");
										}
									} else {
										for ( var j = 0; j < data[i].comments_data.data.length; j++) {
											var bb = "";
											if (data[i].comments_data.data[j].profile_pic == "") {
												bb = "img/suer_profile.png";
											} else {
												bb = BASE_URL
														+ data[i].comments_data.data[j].profile_pic;
											}
											comments += ("<div class='ui-grid-a'	style='width: 100%; float: left; margin-top: 1%;'>	<div class='ui-block-a'	style='width: 10%; height: 25px; float: left;'>	<img src='"+bb+"' height='25px' width='25px' style='border-radius: 50px;'>	</div>	<div class='ui-block-b' style='width: 90%;'><div style='float: left;width: 90%;'><label id='nameC' data-value='"+data[i].comments_data.data[j].user_id+"' style='font-size: small; color: #000000; font-weight: normal;'>"
													+ data[i].comments_data.data[j].name
													+ "</label></div><div style='width: 90%; padding-left: 1%;'><div style='width: 95%; white-space: normal;'>	<label	style='word-wrap: break-word; font-size: 70%; margin-top: 0px;'>"
													+ data[i].comments_data.data[j].comment + "</label></div></div></div></div>");
										}
									}
									var total_comments = "<div style='color: #BBB9BC; float: left; margin-left: 10%; margin-top: 10px;'	id='cmtcount' data-value='"
											+ data[i].post_data.id
											+ "'><label style='font-size: 80%;'>view all "
											+ data[i].comments_data.total_comments
											+ " comments</label>	</div></li>";
									$('#dashboard_list').append(
											post + comments + total_comments);
									for ( var j = 0; j < data[i].likes_data.data.length; j++) {
										console
												.log(data[i].likes_data.data[j].user_id);
										if (data[i].likes_data.data[j].user_id == user_id) {
											$('#dashboard_list li')
													.find(
															'img[data-value="'
																	+ data[i].post_data.id
																	+ '"]')
													.attr('src',
															'img/ic_heart_icon_clk.png');
											break;
										}
									}
								}
								var not_click = false;

								$('#dashboard_list li').click(
										function() {
											if (!not_click) {
												console.log("CMT"
														+ $(this).attr(
																'data-value'));
												dashboard_id = $(this).attr(
														'data-value');
												$.mobile.changePage(
														"data_view.html", {
															changeHash : true
														});
											}
											not_click = false;
										});
								$('#dashboard_list li #nameC').click(function() {
													not_click = true;
													
													view_profile_id = $(this)
															.attr('data-value');
													$.mobile.changePage("view_user.html",{changeHash : true});
								});
								$('#dashboard_list li #cmtcount').click(function() {
													not_click = true;
													dashboard_id = $(this).attr('data-value');
													$.mobile.changePage("data_view.html",{changeHash : true});
								});
								$('#dashboard_list li #like1').click(function() {
													not_click = true;
													
													var vll = $(this).attr('data-value');
													var lk = parseInt($('#dashboard_list li').find('label[data-value="'+ vll+ '"]').text());
													console.log("as>" + lk);

													if ($(this).attr('src') == 'img/ic_heart_icon.png') {
														$(this).attr('src','img/ic_heart_icon_clk.png');
														$('#dashboard_list li').find('label[data-value="'+ vll+ '"]').text(lk + 1);
														//loading();
														$.ajax({
																	url : BASE_URL
																			+ 'api/app/add_like',
																	dataType : 'json',
																	type : 'post',
																	contentType : 'application/x-www-form-urlencoded',
																	data : {
																		user_id : user_id,
																		post_id : $(
																				this)
																				.attr(
																						'data-value')
																	},
																	success : function(
																			data,
																			textStatus,
																			jQxhr) {
																		//console.log(JSON.stringify(data));
																		if (data.status == '1') {

																		} else {
																			console
																					.log(data.data);
																		}
																		//	loading_done();
																	},
																	error : function(
																			jqXhr,
																			textStatus,
																			errorThrown) {
																		console
																				.log(errorThrown);
																		alertSS('Server Error');
																		//	loading_done();
																	}
																});
													} else {
														$(this).attr('src','img/ic_heart_icon.png');
														$('#dashboard_list li').find('label[data-value="'+ vll+ '"]').text(lk - 1);
														//loading();
														$.ajax({
																	url : BASE_URL
																			+ 'api/app/remove_like',
																	dataType : 'json',
																	type : 'post',
																	contentType : 'application/x-www-form-urlencoded',
																	data : {
																		user_id : user_id,
																		post_id : $(
																				this)
																				.attr(
																						'data-value')
																	},
																	success : function(
																			data,
																			textStatus,
																			jQxhr) {
																		//console.log(JSON.stringify(data));
																		if (data.status == '1') {

																		} else {
																			console
																					.log(data.data);
																		}
																		//		loading_done();
																	},
																	error : function(
																			jqXhr,
																			textStatus,
																			errorThrown) {
																		console
																				.log(errorThrown);
																		alertSS('Server Error');
																		//	loading_done();
																	}
																});
													}
												});

								/*		$('#dashboard_list li #like2').click(function(){
											console.log("LK2"+$(this).attr('data-value'));
											var lk = parseInt($(this).text());
											console.log("as>"+lk);
											$(this).text(lk+1);
											$.ajax({
								         		url: BASE_URL+'api/app/add_like',
								         		dataType: 'json',
								         		type: 'post',
								         		contentType: 'application/x-www-form-urlencoded',
								         		data: {user_id: user_id,post_id: $(this).attr('data-value')},
								         		success: function( data, textStatus, jQxhr ){
								         			//console.log(JSON.stringify(data));
								         				if(data.status=='1'){
								         					
								         				}else{
								         					console.log(data.data);
								         				}
								         		},
								         		error: function( jqXhr, textStatus, errorThrown ){
								             		console.log( errorThrown );
								             		alert('Server Error');
								         		}
								     		});
										});
								 */
							}

						});

		
		/*
		 * To show comments of the Post
		 * 
		 */
		
		$(document).on("pageshow","#comments",function(evt, dvt) {
			mytopmargin();
			document.removeEventListener("backbutton",back,false);
			$('#backC').click(function() {
				if(dvt.prevPage.attr('id')=='chatScreen'){
					$.mobile.changePage("dashboard.html",{changeHash : true});
				}else{
					$.mobile.changePage(dvt.prevPage.attr('id')+ ".html",{changeHash : true});					
				}	

			});
			   function ValidURL(str) {
					  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
					  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
					  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
					  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
					  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
					  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
					  if(!pattern.test(str)) {
					    return false;
					  } else {
					    return true;
					  }
					}
			
			loading();
			$.ajax({
						url : BASE_URL + 'api/app/view_file',
						dataType : 'json',
						type : 'post',
						contentType : 'application/x-www-form-urlencoded',
						data : {
							post_id : dashboard_id,
							user_id : user_id
						},
						success : function(data, textStatus,jQxhr) {
							console.log(JSON.stringify(data));
							if (data.status == '1') {
								if(data.post_user_data[0]==null){
									$.mobile.changePage("dashboard.html",{changeHash : true});
								}else{
								
								for ( var j = 0; j < data.comments_data.length; j++) {
									var mypic12 = BASE_URL
											+ data.comments_data[j].profile_pic;
									if (data.comments_data[j].profile_pic == '') {
										mypic12 = 'img/suer_profile.png';
									}
									if(ValidURL(data.comments_data[j].comment)){
										$('#comment_list')
										.append(
												'<li id="'+data.comments_data[j].id+'" data-value="'+data.comments_data[j].comment+'" style="margin-left:18px;"><div style="background:#C0C1C1;width:90%;height:1px;margin-top:3px;margin-bottom:3px;"></div><div class="ui-grid-a"  style="margin-top:8px;"><img id="mypicID" data-value="'+data.comments_data[j].user_id+'" class="ui-block-a" src="'+mypic12+'" style="width: 35px; height: 35px; border-radius: 20px;"><div class="ui-block-b" style="margin-left: 5px;"><label style="text-transform: none; font-weight: bold; font-size: small;">'
														+ data.comments_data[j].name
														+ '</label><p style="text-transform: none; font-size: 12px; font-weight: normal; white-space: pre-wrap;color:#009AFD;text-decoration: underline;">'
														+ data.comments_data[j].comment
														+ '</p></div></div></li>');
										
									}else{
										
										$('#comment_list')
										.append(
												'<li id="'+data.comments_data[j].id+'" data-value="'+data.comments_data[j].comment+'" style="margin-left:18px;"><div style="background:#C0C1C1;width:90%;height:1px;margin-top:3px;margin-bottom:3px;"></div><div class="ui-grid-a"  style="margin-top:8px;"><img id="mypicID" data-value="'+data.comments_data[j].user_id+'" class="ui-block-a" src="'+mypic12+'" style="width: 35px; height: 35px; border-radius: 20px;"><div class="ui-block-b" style="margin-left: 5px;"><label style="text-transform: none; font-weight: bold; font-size: small;">'
														+ data.comments_data[j].name
														+ '</label><p style="text-transform: none; font-size: 12px; font-weight: normal; white-space: pre-wrap;">'
														+ data.comments_data[j].comment
														+ '</p></div></div></li>');
								}
								}
								if(data.comments_data.length>0){
									location.hash = data.comments_data[data.comments_data.length-1].id;
								}else{
									alertSS('No Comments');
								}

							}
							} else {
								alertSS(data.data);
							}
							loading_done();
						},
						error : function(jqXhr, textStatus,
								errorThrown) {
							console.log(errorThrown);
							alertSS('Server Error');
							loading_done();
						}
					});
			$("#comment_list").on("click", "#mypicID", function() {
				console.log($(this).attr('data-value'));
				imgClick=true;
				var mm = $(this).attr('data-value');
				view_profile_id = $(this).attr('data-value');
				$.mobile.changePage("view_user.html",{changeHash : true});
			});
			
			$("#comment_list").on("click", "li", function() {
				console.log($(this).attr('data-value'));
				if(!imgClick){
					var mms=$(this).attr('data-value');
					if(ValidURL(mms)){
						if (mms.substring(0, 7) != "http://")
							mms = "http://" + mms;
						var ref = window.open(mms,'_blank','location=yes');
					}
				}else{
					imgClick=false;
				}

			});
			
			
			var myname = "";
			var mypic = "";
			$.ajax({
						url : BASE_URL+'profile.php',
						dataType : 'json',
						type : 'post',
						contentType : 'application/x-www-form-urlencoded',
						data : {
							user_id : user_id
						},
						success : function(data, textStatus,
								jQxhr) {
							//console.log(JSON.stringify(data));
							if (data.profile.length > 0) {
								myname = data.profile[0].user_name;
								mypic = data.profile[0].profile_pic;
							} else {
								console.log(data.data);
							}
						},
						error : function(jqXhr, textStatus,
								errorThrown) {
							console.log(errorThrown);
							alertSS('Server Error');
						}
					});

			
			
			
			$('#cmt_btn').click(function() {
				var msg = $('#cmt_msg').val();
				if (msg != null) {
					if (msg != "") {
						if (msg.length > 0) {
							if (mypic == BASE_URL) {
								mypic = "img/suer_profile.png";
							}
							
							$('#cmt_msg').focus();
							$('#cmt_msg').val('');
							$.ajax({
										url : BASE_URL
												+ 'api/app/add_comment',
										dataType : 'json',
										type : 'post',
										contentType : 'application/x-www-form-urlencoded',
										data : {
											post_id : dashboard_id,
											user_id : user_id,
											comment : msg
										},
										success : function(
												data,
												textStatus,
												jQxhr) {
											console.log(JSON.stringify(data));
											if (data.status == '1') {
												console
														.log("Sent");
												if(ValidURL(msg)){
													$('#comment_list')
													.append(
															'<li id="'+data.data.id+'" data-value="'+msg+'" style="margin-left:18px;"><div style="background:#C0C1C1;width:90%;height:1px;margin-top:3px;margin-bottom:3px;"></div><div class="ui-grid-a" style="margin-top:8px;"><img id="mypicID" data-value="'+user_id+'" class="ui-block-a" src="'+mypic+'"	style="width: 35px; height: 35px; border-radius: 20px;"><div class="ui-block-b" style="margin-left: 5px;"><label style="text-transform: none; font-weight: bold; font-size: small;">'
																	+ myname
																	+ '</label><p style="text-transform: none; font-size: 12px; font-weight: normal; white-space: pre-wrap;color:#009AFD;text-decoration: underline;">'
																	+ msg
																	+ '</p></div></div></li>');
												}else{
													$('#comment_list')
													.append(
															'<li id="'+data.data.id+'" data-value="'+msg+'" style="margin-left:18px;"><div style="background:#C0C1C1;width:90%;height:1px;margin-top:3px;margin-bottom:3px;"></div><div class="ui-grid-a" style="margin-top:8px;"><img id="mypicID" data-value="'+user_id+'" class="ui-block-a" src="'+mypic+'"	style="width: 35px; height: 35px; border-radius: 20px;"><div class="ui-block-b" style="margin-left: 5px;"><label style="text-transform: none; font-weight: bold; font-size: small;">'
																	+ myname
																	+ '</label><p style="text-transform: none; font-size: 12px; font-weight: normal; white-space: pre-wrap;">'
																	+ msg
																	+ '</p></div></div></li>');
												}
												location.hash = data.data.id;
												$('#cmt_msg').focus();
											} else {
												console
														.log(data.data);
											}
										},
										error : function(
												jqXhr,
												textStatus,
												errorThrown) {
											console
													.log(errorThrown);
											alertSS('Server Error');
										}
									});
						}
					}
				}
			});
		});
		
		
		/*
		 * User Chat Show All Messages of Users
		 * 
		 */
		
		$(document).on("pageshow","#messageMain",function(evt, dvt) {
			mytopmargin();
			show_all_msg='1';
			document.removeEventListener("backbutton",back,false);
			conversation_id='';
			$('#backC').click(function() {
				if(dvt.prevPage.attr('id')=='chatScreen'){
					$.mobile.changePage("dashboard.html",{changeHash : true});
				}else{
					$.mobile.changePage(dvt.prevPage.attr('id')+ ".html",{changeHash : true});					
				}	

			});
			$.ajax({
				url : BASE_URL
						+ 'api/app/get_notifications',
				dataType : 'json',
				type : 'post',
				contentType : 'application/x-www-form-urlencoded',
				data : {
					user_id : user_id
				},
				success : function(data, textStatus,
						jQxhr) {
					console.log(JSON.stringify(data));
					if (data.status == '1') {
						$('#noti_count').css('display','');
						if(data.notification.unread==0){
							$('#noti_count').css('display','none');
						}else if(data.notification.unread > 7){
							$('#noti_count').text('7+');
						}else{
							$('#noti_count').text(data.notification.unread);
						}
						
					} else {
						alertSS(data.data);
					}
				},
				error : function(jqXhr, textStatus,
						errorThrown) {
					console.log(errorThrown);
					alertSS('Server Error');
				}
			});
			function show_msg(data){
				
				for(var i=0;i<data.length;i++){
					var jpic=BASE_URL+data[i].profile_pic;
					if(data[i].profile_pic==''){
						jpic='img/suer_profile.png';
					}
					console.log(data[i].conversation_id);
					$('#msg_list').append('<li id="'+data[i].conversation_id+'" data-value="'+data[i].conversation_id+'" style="width:97%;height:55px;text-align:center;padding:0px;margin:0px;margin-top:5px;display:inline-block;"><div class="ui-grid-a" style="text-align:center;">	<img class="ui-block-a" src="'+jpic+'"	style="height: 45px; width: 45px;margin-left:8px;">	<div class="ui-block-b" style="margin-left:8px;">	<label	style="text-transform: none; text-align: left; text-shadow: none; font-weight: bold; font-size: medium; color: black;">'+data[i].user_name+'</label>	<p	style="text-transform: none; text-align: left; text-shadow: none; font-size: medium; font-weight: lighter; color: #a9a9a9;">'+data[i].last_message+'</p>	</div>	</div>   <div style="height:1px;width:100%;background:#a9a9a9;float:left;"></div>	</li>');
				}
				$('#msg_list li').click(function(){
					var id=$(this).attr('data-value');
					console.log(id);
					conversation_id=id;
					$.mobile.changePage("chatScreen.html",{changeHash : true});
				});
				
				
				
				$('#msg_list li').bind( "taphold", tapholdHandler );
				 
				  function tapholdHandler( event ){
					  console.log($(this).attr('data-value'));
					  var kid=$(this).attr('data-value');
					  
					  navigator.notification.confirm(
							   "Are you sure to delete the conversation?",
							    callBackFunction, // Specify a function to be called 
							    'MalibuSelfies',
							    ["Ok", "Cancel"]
							);

							function callBackFunction(b){
							  if(b == 1){
							    console.log("user said ok");
							    
							    loading();
								$.ajax({
											url : BASE_URL + 'api/app/delete_conversation',
											dataType : 'json',
											type : 'post',
											contentType : 'application/x-www-form-urlencoded',
											data : {
												user_id: user_id,
												conversation_id: kid
											},
											success : function(data, textStatus,jQxhr) {
												console.log(JSON.stringify(data));
												loading_done();
												if (data.status == '1') {
													 $('#'+kid).remove();
												}else{
													alertSS(data.data);
												}
											},
											error : function(jqXhr, textStatus,
													errorThrown) {
												console.log(errorThrown);
												alertSS('Server Error');
												loading_done();
											}
								});	
							    
							   
							  }
							  else {
							    console.log("user said Awesome");
							  }
							}
				  }
				
				
				loading_done();
			}
			
			
			loading();
			$.ajax({
						url : BASE_URL + 'api/app/get_all_conversations',
						dataType : 'json',
						type : 'post',
						contentType : 'application/x-www-form-urlencoded',
						data : {
							user_id : user_id
						},
						success : function(data, textStatus,jQxhr) {
							console.log(JSON.stringify(data));
							if (data.status == '1') {
								if(data.data.length>0){
									show_msg(data.data);									
								}else{
									alertSS("No Messages");
									loading_done();
								}

							}else{
								alertSS(data.data);
								loading_done();
							}
						},
						error : function(jqXhr, textStatus,
								errorThrown) {
							console.log(errorThrown);
							alertSS('Server Error');
							loading_done();
						}
			});	
			
		});
		
		
		
		/*
		 * Used to show chat messages with particular user
		 */
		
		
		$(document).on("pageshow","#chatScreen",function(evt, dvt) {
			mytopmargin();
			
			document.removeEventListener("backbutton",back,false);
			
			var sender_name='';
			var sender_pic='';
			
			$('#user_pic').click(function(){
				if(to_view_profile!=''){
					view_profile_id=to_view_profile;
					$.mobile.changePage("view_user.html",{changeHash : true});
				}
			});
			
			$('#user_name').click(function(){
				if(to_view_profile!=''){
					view_profile_id=to_view_profile;
					$.mobile.changePage("view_user.html",{changeHash : true});
				}
			});
			
			var offset = new Date().getTimezoneOffset();
			console.log(offset);
			var clickTR=true;
			
			function show_msg(data){
				$('#chat_list').empty();
				for(var i=0;i<data.length;i++){
					//var dt = new Date(data[i].created+' UTC');
					//var dt = new Date(data[i].created);
					var dt=dateFromString(data[i].created+' UTC');
					var time = dt.getHours() + ":" + dt.getMinutes();
					console.log(data[i].created+"<><><>"+dt.toString());
					var jpic=BASE_URL+data[i].profile_pic;
					if(data[i].profile_pic==''){
						jpic='img/suer_profile.png';
					}
					
					if(data[i].sender_id != user_id){
						if(ValidURL(data[i].message)){
							$('#chat_list').append('<li	id="'+data[i].message_id+'" data-value="'+data[i].message+'" style="background: transparent; background-color: transparent; width: 100%;margin-top:10px;">	<div class="ui-grid-b" style="background: transparent;padding-left:5px;margin-left:6%;"><div class="ui-block-a"	style="width: 15%; background: transparent; float: left;">	<img style="width: 40px; height: 40px;" src="'+jpic+'"></div>	<img class="ui-block-b" src="img/left_icon_ic.png"	style="height: 27px; width: 27px; margin-top: 10px; background-repeat: no-repeat; background-size: cover;"><div class="ui-block-c" style="background: white; padding: 6px 12px; border-radius: 8px; width: 70%;">	<label	style="text-transform: none; text-shadow: none; text-align: left; font-weight: bold; font-size: medium; width: 90%;">'+data[i].name+'</label><p	style="text-transform: none; text-shadow: none; text-align: left; font-weight: lighter; font-size: small; width: 90%; white-space: pre-line; word-wrap: break-word;color:#009AFD;text-decoration: underline; ">'+data[i].message+'</p>	<label	style="text-transform: none; text-shadow: none; text-align: left; color: #93cbe2; font-size: small;">'+time+'</label>	</div>	</div></li>');						
						}else{
							$('#chat_list').append('<li	id="'+data[i].message_id+'" data-value="'+data[i].message+'" style="background: transparent; background-color: transparent; width: 100%;margin-top:10px;">	<div class="ui-grid-b" style="background: transparent;padding-left:5px;margin-left:6%;"><div class="ui-block-a"	style="width: 15%; background: transparent; float: left;">	<img style="width: 40px; height: 40px;" src="'+jpic+'"></div>	<img class="ui-block-b" src="img/left_icon_ic.png"	style="height: 27px; width: 27px; margin-top: 10px; background-repeat: no-repeat; background-size: cover;"><div class="ui-block-c" style="background: white; padding: 6px 12px; border-radius: 8px; width: 70%;">	<label	style="text-transform: none; text-shadow: none; text-align: left; font-weight: bold; font-size: medium; width: 90%;">'+data[i].name+'</label><p	style="text-transform: none; text-shadow: none; text-align: left; font-weight: lighter; font-size: small; width: 90%; white-space: pre-line; word-wrap: break-word;">'+data[i].message+'</p>	<label	style="text-transform: none; text-shadow: none; text-align: left; color: #93cbe2; font-size: small;">'+time+'</label>	</div>	</div></li>');						
						}
					}else if(data[i].sender_id == user_id){
						if(ValidURL(data[i].message)){
							$('#chat_list').append('<li id="'+data[i].message_id+'" data-value="'+data[i].message+'"	style="background: transparent; background-color: transparent; width: 100%;margin-top:10px;">	<div class="ui-grid-b" style="background: transparent;padding-left:5px;margin-left:6%;"><div class="ui-block-a"	style="background: white; padding: 6px 12px; border-radius: 8px; width: 70%;">	<label	style="text-transform: none; text-shadow: none; text-align: left; font-weight: bold; font-size: medium; width: 90%;">'+data[i].name+'</label><p	style="text-transform: none; text-shadow: none; text-align: left; font-weight: lighter; font-size: small; width: 90%; white-space: pre-line; word-wrap: break-word;color:#009AFD;text-decoration: underline;">'+data[i].message+'</p>	<label	style="text-transform: none; text-shadow: none; text-align: left; color: #93cbe2; font-size: small;">'+time+'</label></div><img class="ui-block-b"	src="img/right_icon_ic.png" style="height: 25px; width: 25px; margin-top: 10px; background-repeat: no-repeat; background-size: cover;"><div class="ui-block-c" style="width: 15%; background: transparent; float: right; margin-right: 9px;">	<img style="width: 40px; height: 40px;" src="'+jpic+'"></div></div></li>');
						}else if(findUrls(data[i].message)!=""){
							console.log("adsj sd");
							var arr=[];
							arr=findUrls(data[i].message);
							//console.log(arr.length);
							var res = (data[i].message).split(" ");
							var stradd="";
							for(var j=0;j<res.length;j++){
								var add=true;
								if(arr!=null){
									for(var qi=0;qi<arr.length;qi++){
										if(res[j]==arr[qi]){
											add=false;
											console.log("ADD>"+res[j]);	
											stradd+='<p id="msgclk" data-value="'+res[j]+'"	style="text-transform: none; text-shadow: none; text-align: left; font-weight: lighter; font-size: small; white-space: pre-line; word-wrap: break-word;color:#009AFD;text-decoration: underline;display:inline-block;padding-left:3px;">'+res[j]+'</p>';
												break;
										}
									}									
								}
								if(add){
									stradd+='<p id="msgclk" data-value="'+res[j]+'"	style="text-transform: none; text-shadow: none; text-align: left; font-weight: lighter; font-size: small; white-space: pre-line; word-wrap: break-word;display:inline-block;padding-left:3px;">'+res[j]+'</p>';
								}
							}
							$('#chat_list').append('<li id="'+data[i].message_id+'" data-value="'+data[i].message+'"	style="background: transparent; background-color: transparent; width: 100%;margin-top:10px;">	<div class="ui-grid-b" style="background: transparent;padding-left:5px;margin-left:6%;"><div class="ui-block-a"	style="background: white; padding: 6px 12px; border-radius: 8px; width: 70%;">	<label	style="text-transform: none; text-shadow: none; text-align: left; font-weight: bold; font-size: medium; width: 90%;">'+data[i].name+'</label>'+stradd+'	<label	style="text-transform: none; text-shadow: none; text-align: left; color: #93cbe2; font-size: small;">'+time+'</label></div><img class="ui-block-b"	src="img/right_icon_ic.png" style="height: 25px; width: 25px; margin-top: 10px; background-repeat: no-repeat; background-size: cover;"><div class="ui-block-c" style="width: 15%; background: transparent; float: right; margin-right: 9px;">	<img style="width: 40px; height: 40px;" src="'+jpic+'"></div></div></li>');
						}else{
							$('#chat_list').append('<li id="'+data[i].message_id+'" data-value="'+data[i].message+'"	style="background: transparent; background-color: transparent; width: 100%;margin-top:10px;">	<div class="ui-grid-b" style="background: transparent;padding-left:5px;margin-left:6%;"><div class="ui-block-a"	style="background: white; padding: 6px 12px; border-radius: 8px; width: 70%;">	<label	style="text-transform: none; text-shadow: none; text-align: left; font-weight: bold; font-size: medium; width: 90%;">'+data[i].name+'</label><p	style="text-transform: none; text-shadow: none; text-align: left; font-weight: lighter; font-size: small; width: 90%; white-space: pre-line; word-wrap: break-word;">'+data[i].message+'</p>	<label	style="text-transform: none; text-shadow: none; text-align: left; color: #93cbe2; font-size: small;">'+time+'</label></div><img class="ui-block-b"	src="img/right_icon_ic.png" style="height: 25px; width: 25px; margin-top: 10px; background-repeat: no-repeat; background-size: cover;"><div class="ui-block-c" style="width: 15%; background: transparent; float: right; margin-right: 9px;">	<img style="width: 40px; height: 40px;" src="'+jpic+'"></div></div></li>');
						}
					}else{
						console.log('NO MY Chat');
					}
				}
//				$('#chat_list li').click(function(){
//					console.log("outide");
//					//if(clickTR){
//						console.log($(this).attr('data-value'));
//						var mms=$(this).attr('data-value');
//						if(ValidURL(mms)){
//							if (mms.substring(0, 7) != "http://")
//								mms = "http://" + mms;
//							var ref = window.open(mms,'_blank','location=yes');
//						}
//					//}else{
//					//	clickTR=true;
//					//}
//				});
				
				$("#chat_list").on("click", "li", function() {
					console.log($(this).attr('data-value'));
					var mms=$(this).attr('data-value');
					if(ValidURL(mms)){
						if (mms.substring(0, 7) != "http://")
							mms = "http://" + mms;
						var ref = window.open(mms,'_blank','location=yes');
					}
				});
				
				$("#chat_list").on("click", "p", function() {
					console.log($(this).attr('data-value'));
					var mms=$(this).attr('data-value');
					if(ValidURL(mms)){
						if (mms.substring(0, 7) != "http://")
							mms = "http://" + mms;
						var ref = window.open(mms,'_blank','location=yes');
					}
				});
				
				
				$("#chat_list").on("taphold", "li", tapholdHandler);
				//$('#chat_list li').bind( "taphold", tapholdHandler );
				 
				  function tapholdHandler( event ){
					  console.log($(this).attr('data-value'));
					  var kid=$(this).attr('data-value');
					  
					  navigator.notification.confirm(
							   "Are you sure to delete the message?",
							    callBackFunction, // Specify a function to be called 
							    'MalibuSelfies',
							    ["Ok", "Cancel"]
							);

							function callBackFunction(b){
							  if(b == 1){
							    console.log("user said ok");
							    
							    loading();
								$.ajax({
											url : BASE_URL + 'api/app/delete_msgs',
											dataType : 'json',
											type : 'post',
											contentType : 'application/x-www-form-urlencoded',
											data : {
												msg_id: kid,
												user_id:user_id
											},
											success : function(data, textStatus,jQxhr) {
												console.log(JSON.stringify(data));
												loading_done();
												if (data.status == '1') {
													 $('#'+kid).remove();
												}else{
													alertSS(data.data);
												}
											},
											error : function(jqXhr, textStatus,
													errorThrown) {
												console.log(errorThrown);
												alertSS('Server Error');
												loading_done();
											}
								});	
							    
							   
							  }
							  else {
							    console.log("user said Awesome");
							  }
							}
				  }
				  
				location.hash = data[data.length-1].message_id;
				$('#msg_text').val('');
				loading_done();
			}
			
//			function ValidURL(str) {
//				//if (str.substring(0, 7) != "http://")
//				//{  str = "http://" + str;}
//				var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
//				return regexp.test(str);
//			}
			
			function ValidURL(str) {
				  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
				  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
				  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
				  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
				  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
				  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
				  if(!pattern.test(str)) {
				    return false;
				  } else {
				    return true;
				  }
				}
			console.log("JHK>>"+conversation_id);
			
			$('#send_msg').click(function(){
				//var dt = new Date();
				//var time = dt.getHours() + ":" + dt.getMinutes();
				//var time=dt.getTime();
				console.log("JHK>>"+conversation_id);
				var msg=$('#msg_text').val();
				var mmp=msg.replace(/\s/g, '');
				if(mmp.length > 0){
				if(msg!='' || msg.length>0) {
					
					loading();
					$.ajax({
								url : BASE_URL + 'api/app/conversation_temp',
								dataType : 'json',
								type : 'post',
								contentType : 'application/x-www-form-urlencoded',
								data : {
									conversation_id : conversation_id,
									sender_id : user_id,
									receiver_id:to_view_profile,
									message: msg
								},
								success : function(data, textStatus,jQxhr) {
									console.log(JSON.stringify(data));
									loading_done();
									if (data.status == '1') {
										//var dt = new Date(data.data.created+' UTC');
										//var dt = new Date(data.data.created);
										var dt=dateFromString(data.data.created+' UTC');
										var time = dt.getHours() + ":" + dt.getMinutes();
										var jpic=BASE_URL+sender_pic;
										if (sender_pic.indexOf(BASE_URL) >= 0){
											jpic=sender_pic;
										}

										if(sender_pic==''){
											jpic='img/suer_profile.png';
										}
										console.log('FINAL'+jpic);
										//$('#chat_list').append('<li	id="'+data.data.message_id+'" data-value="'+data.data.message_id+'" style="background: transparent; background-color: transparent; width: 100%;margin-top:8px;">	<div class="ui-grid-b" style="background: transparent;padding-left:5px;margin-left:6%;"><div class="ui-block-a"	style="width: 15%; background: transparent; float: left;">	<img style="width: 40px; height: 40px;" src="'+jpic+'"></div>	<img class="ui-block-b" src="img/left_icon_ic.png"	style="height: 27px; width: 27px; margin-top: 10px; background-repeat: no-repeat; background-size: cover;"><div class="ui-block-c" style="background: white; padding: 12px; border-radius: 8px; width: 70%;">	<label	style="text-transform: none; text-shadow: none; text-align: left; font-weight: bold; font-size: medium; width: 90%;">'+sender_name+'</label><p	style="text-transform: none; text-shadow: none; text-align: left; font-weight: lighter; font-size: x-small; width: 90%; white-space: pre-line; word-wrap: break-word;">'+data.data.message+'</p>	<label	style="text-transform: none; text-shadow: none; text-align: left; color: #93cbe2; font-size: x-small;">'+time+'</label>	</div>	</div></li>');	
										if(ValidURL(msg)){
											console.log("Valid");
											$('#chat_list').append('<li id="'+data.data.message_id+'" data-value="'+data.data.message+'"	style="background: transparent; background-color: transparent; width: 100%;margin-top:10px;">	<div class="ui-grid-b" style="background: transparent;padding-left:5px;margin-left:6%;"><div class="ui-block-a"	style="background: white; padding: 6px 12px; border-radius: 8px; width: 70%;">	<label	style="text-transform: none; text-shadow: none; text-align: left; font-weight: bold; font-size: medium; width: 90%;">'+sender_name+'</label><p	style="text-transform: none; text-shadow: none; text-align: left; font-weight: lighter; font-size: small; width: 90%; white-space: pre-line; word-wrap: break-word;color:#009AFD;text-decoration: underline;">'+data.data.message+'</p>	<label	style="text-transform: none; text-shadow: none; text-align: left; color: #93cbe2; font-size: small;">'+time+'</label></div><img class="ui-block-b"	src="img/right_icon_ic.png" style="height: 25px; width: 25px; margin-top: 10px; background-repeat: no-repeat; background-size: cover;"><div class="ui-block-c" style="width: 15%; background: transparent; float: right; margin-right: 9px;">	<img style="width: 40px; height: 40px;" src="'+jpic+'"></div></div></li>');
										}else if(findUrls(msg)!=null){
											console.log("adsj sd");
											var arr=[];
											arr=findUrls(msg);
											console.log(arr.length);
											var res = data.data.message.split(" ");
											var stradd="";
											for(var j=0;j<res.length;j++){
												var add=true;
												for(var i=0;i<arr.length;i++){
													if(res[j]==arr[i]){
														add=false;
 														stradd+='<p data-value="'+res[j]+'"	style="text-transform: none; text-shadow: none; text-align: left; font-weight: lighter; font-size: small;  white-space: pre-line; word-wrap: break-word;color:#009AFD;text-decoration: underline;display:inline-block;padding-left:3px;">'+res[j]+'</p>';
 														break;
													}
												}
												if(add){
													stradd+='<p data-value="'+res[j]+'"	style="text-transform: none; text-shadow: none; text-align: left; font-weight: lighter; font-size: small; white-space: pre-line; word-wrap: break-word;display:inline-block;padding-left:3px;">'+res[j]+'</p>';
												}
											}
											$('#chat_list').append('<li id="'+data.data.message_id+'" data-value="'+data.data.message+'"	style="background: transparent; background-color: transparent; width: 100%;margin-top:10px;">	<div class="ui-grid-b" style="background: transparent;padding-left:5px;margin-left:6%;"><div class="ui-block-a"	style="background: white; padding: 6px 12px; border-radius: 8px; width: 70%;">	<label	style="text-transform: none; text-shadow: none; text-align: left; font-weight: bold; font-size: medium; width: 90%;">'+sender_name+'</label>'+stradd+'	<label	style="text-transform: none; text-shadow: none; text-align: left; color: #93cbe2; font-size: small;">'+time+'</label></div><img class="ui-block-b"	src="img/right_icon_ic.png" style="height: 25px; width: 25px; margin-top: 10px; background-repeat: no-repeat; background-size: cover;"><div class="ui-block-c" style="width: 15%; background: transparent; float: right; margin-right: 9px;">	<img style="width: 40px; height: 40px;" src="'+jpic+'"></div></div></li>');
										}
										else{
											console.log("INValid");
											$('#chat_list').append('<li id="'+data.data.message_id+'" data-value="'+data.data.message+'"	style="background: transparent; background-color: transparent; width: 100%;margin-top:10px;">	<div class="ui-grid-b" style="background: transparent;padding-left:5px;margin-left:6%;"><div class="ui-block-a"	style="background: white; padding: 6px 12px; border-radius: 8px; width: 70%;">	<label	style="text-transform: none; text-shadow: none; text-align: left; font-weight: bold; font-size: medium; width: 90%;">'+sender_name+'</label><p	style="text-transform: none; text-shadow: none; text-align: left; font-weight: lighter; font-size: small; width: 90%; white-space: pre-line; word-wrap: break-word;">'+data.data.message+'</p>	<label	style="text-transform: none; text-shadow: none; text-align: left; color: #93cbe2; font-size: small;">'+time+'</label></div><img class="ui-block-b"	src="img/right_icon_ic.png" style="height: 25px; width: 25px; margin-top: 10px; background-repeat: no-repeat; background-size: cover;"><div class="ui-block-c" style="width: 15%; background: transparent; float: right; margin-right: 9px;">	<img style="width: 40px; height: 40px;" src="'+jpic+'"></div></div></li>');
										}
									
//										$('#chat_list li').click(function(){
//											console.log("inside");
//											//if(clickTR){
//												clickTR=false;
//												console.log($(this).attr('data-value'));
//												var mms=$(this).attr('data-value');
//												if(ValidURL(mms)){
//													if (mms.substring(0, 7) != "http://")
//														mms = "http://" + mms;
//													var ref = window.open(mms,'_blank','location=yes');
//													
//												}
//											//}else{
//											//	clickTR=true;
//											//}
//										});
										
										location.hash = data.data.message_id;
										conversation_id=data.data.conversation_id;
									}else{
										alertSS(data.data);
									}
								},
								error : function(jqXhr, textStatus,
										errorThrown) {
									console.log(errorThrown);
									alertSS('Server Error');
									loading_done();
								}
					});	
					
				}else{
					console.log("blank msg");
				}
			}
				$('#msg_text').val('');

		});
			
			
			function findUrls( text )
			{
			    var source = (text || '').toString();
			    var urlArray = [];
			    // Iterate through any URLs in the text.
			    urlArray = source.match(/\b(http|https)?(:\/\/)?(\S*)\.(\w{2,4})\b/ig);
			    //console.log(urlArray);
			    return urlArray;
			}
			
		function refresh(){	
			console.log(conversation_id);
			loading();
			$.ajax({
						url : BASE_URL + 'api/app/get_conversation_temp',
						dataType : 'json',
						type : 'post',
						contentType : 'application/x-www-form-urlencoded',
						data : {
							conversation_id : conversation_id,
							sender_id : user_id
						},
						success : function(data, textStatus,jQxhr) {
							console.log(JSON.stringify(data));
							if (data.status == '1') {
								
									if(data.receiver_profile.profile_pic==''){
										$('#user_pic').attr('src','img/suer_profile.png');
									}else{
										$('#user_pic').attr('src',BASE_URL+data.receiver_profile.profile_pic);										
									}

									$('#user_name').text(data.receiver_profile.user_name);
									to_view_profile=data.receiver_profile.id;
									sender_name=data.sender_profile.user_name;
									sender_pic=data.sender_profile.profile_pic;
									if(data.data.length>0){
										show_msg(data.data);	
									}else{
									console.log("No Chat");
									
								}
									loading_done();
							}else{
								console.log(data.message);
								to_view_profile=for_chat_user_id;
								//sender_name=for_chat_user_name;
								//sender_pic=for_chat_user_pic;
								if(for_chat_user_pic==''){
									$('#user_pic').attr('src','img/suer_profile.png');
								}else{
									$('#user_pic').attr('src',BASE_URL+for_chat_user_pic);										
								}
								$('#user_name').text(for_chat_user_name);
								loading_done();
							}
						},
						error : function(jqXhr, textStatus,
								errorThrown) {
							console.log(errorThrown);
							alertSS('Server Error');
							loading_done();
						}
			});
			
		}	
			refresh();
			$('#refresh').click(function(){
				refresh();
			});
			
			if(device.platform === 'Android'){
				$('#refresh').css('display','none');
			}else{
				$('#refresh').css('display','');
			}
			
			$.ajax({
						url : BASE_URL
								+ 'api/app/get_user_profile',
						dataType : 'json',
						type : 'post',
						contentType : 'application/x-www-form-urlencoded',
						data : {user_id:user_id},
						success : function(data,
								textStatus, jQxhr) {
							console.log(JSON
									.stringify(data));
							if (data.profile.length > 0) {
								//console.log(data.data);
								sender_name=data.profile[0].user_name;
								sender_pic=data.profile[0].profile_pic;
								if(data.profile[0].profile_pic=='' || data.profile[0].profile_pic == BASE_URL){
									sender_pic='';
								}
								
							} else {
								alertSS(data.data);
							}
						},
						error : function(jqXhr, textStatus,
								errorThrown) {
							console.log(errorThrown);
							alertSS('Server Error');
						}
					});
			
		});
		
		
		/*
		To show details for a single post with all cments and all likes
		*/
		
		$(document).on("pageshow","#data_view",function(evt, dvt) {
							console.log("the previous page was: "
									+ dvt.prevPage.attr('id'));
							document.removeEventListener("backbutton",back,false);
										$('#backC').click(function() {
												if (dvt.prevPage.attr('id') == "view_user") {
													$.mobile.changePage("dashboard.html",{changeHash : true});
												}else if (dvt.prevPage.attr('id') == "add_details") {
													$.mobile.changePage("dashboard.html",{changeHash : true});
												} else {
													$.mobile.changePage(dvt.prevPage.attr('id')+ ".html",{changeHash : true});
												}
											});

							mytopmargin();
							img_temp_id=dashboard_id;
							var follow_id = 0;
							var comments_checked=0;
							var temp_view_id='';
							loading();
                       //alert(dashboard_id);
                       //alert(user_id)
							$.ajax({
										url : BASE_URL + 'view_file.php',
										dataType : 'json',
										type : 'post',
										contentType : 'application/x-www-form-urlencoded',
										data : {
											post_id : dashboard_id,
											userid : user_id
										},
										success : function(data, textStatus,jQxhr) {
											console.log(JSON.stringify(data));
											if (data.post_user_data.length > 0) {
												loading_done();
												if(data.post_user_data[0]==null){
													$.mobile.changePage("dashboard.html",{changeHash : true});
												}else{
													if(data.post_user_data[0].type=='video'){
														img_to_show_type='vid';
													}else{
														img_to_show_type='img';
													}
//                                                if (data.post_user_data[0].profile_pic != '') {
//                                                    $('#user_img').attr('src',BASE_URL+ data.post_user_data[0].profile_pic);
//                                                }
												temp_view_id = data.post_user_data[0].user_id;
												
												
												if(temp_view_id==user_id){
													console.log("AUTOHORIZED");
													$("#edOption").append(new Option("Edit", "edit"));
													$("#edOption").append(new Option("Delete", "delete"));
												}else{
													console.log("NOT AUTH");
													/*$("#edOption option[value='Edit']").remove();
													$("#edOption option[value='Delete']").remove();
												
													$("#edOption option[value='Edit']").each(function() {
													    $(this).remove();
													});
													$("#edOption option[value='Delete']").each(function() {
													    $(this).remove();
													});*/
												}
												
												
												
												if (data.post_user_data[0].user_id == user_id) {
													$('#follow').css('display','none');
												}
												$('#username').text(data.post_user_data[0].name);
												$('#username').click(function() {
														var ik = data.post_user_data[0].user_id;
														view_profile_id = ik;
														$.mobile.changePage("view_user.html",{changeHash : true});
												});
												if (data.post_user_data[0].type == "image") {
													$('#postimg').attr('src',BASE_URL+ data.post_user_data[0].file_name);
													img_to_show=BASE_URL + data.post_user_data[0].file_name;
													img_to_show1=BASE_URL + data.post_user_data[0].file_name;
												} else {
													var mmc = data.post_user_data[0].file_name;
													var vid_post_id = data.post_user_data[0].id;
													$('#postimg').attr('src',BASE_URL+ mmc.replace(".mp4",".jpg"));
													
													
													/*if(mmc.indexOf(".MOV")>0){
														$('#postimg').attr('src',BASE_URL+ mmc.replace(".MOV",".jpg"));
														img_to_show=BASE_URL+ mmc.replace(".MOV",".jpg");
													}*/
													
													//$("#showVId").css('display','');
													img_to_show=BASE_URL+ mmc.replace(".mp4",".jpg");
													img_to_show1=BASE_URL+ mmc;
													
													$('#postimg').click(function() {
																		var ref = window.open(BASE_URL+'video/view/'
																								+ vid_post_id,
																						'_blank',
																						'location=no');
																		
													});
												}

												$('#topcaption').text(data.post_user_data[0].name);
												cap_to_show=data.post_user_data[0].caption;
												$('#caption').text(data.post_user_data[0].caption);
												$('#totallike').text(data.post_user_data[0].total_likes+ " Likes");
												
                                   
                                   
//                                                for ( var m = 0; m < data.likes_data.length; m++) {
//                                                    var pic=data.likes_data[m].profile_pic;
//                                                    if(pic==''){
//                                                        pic='img/suer_profile.png';
//                                                    }else{
//                                                        pic=BASE_URL+data.likes_data[m].profile_pic;
//                                                    }
//                                                    $('#likeslisT').append('<li data-value="'+data.likes_data[m].user_id+'" style="height: 50px; background: transparent; padding: 2px;border-bottom: 1px solid white;"><div    class="ui-grid-a">    <img class="ui-block-a" src="'+pic+'"    style="width: 45px; height: 45px;"><label    style="width: 65%; color: white; text-transform: none; text-shadow: none; text-align: center; line-height: 45px; height: 45px;">'+data.likes_data[m].name+'</label>    </div></li>');
//                                                }
												$('#likeslisT li').click(function(){
													var id=$(this).attr('data-value');
													console.log(id);
													view_profile_id =id;
													$.mobile.changePage("view_user.html",{changeHash : true});
												});
												//need to work ashutosh ..
                                   if(data.post_user_data[0].user_like == "yes"){
                                   $('#ilike')
                                   .attr('src',
                                         'img/ic_heart_icon_clk.png');

                                   }
                                   
//                                                for ( var m = 0; m < data.likes_data.length; m++) {
//                                                    if (data.likes_data[m].user_id == user_id) {
//                                                        $('#ilike')
//                                                                .attr('src',
//                                                                        'img/ic_heart_icon_clk.png');
//                                                        break;
//                                                    }
//                                                }
												$('#totalcomments').text(data.post_user_data[0].total_comment+ " Comments");
												comments_checked = parseInt(data.total_comments);
												
												if (data.post_user_data[0].is_followed == '1') {
													$('#follow').text('Following');
													$('#follow').css('border','1px solid #00D88E');
													$('#follow').css('color','#00D88E');
												}
												follow_id = data.post_user_data[0].user_id;
												//data.post_user_data[0].loc_lat+"--"+data.post_user_data[0].loc_log
												 current_lat = data.post_user_data[0].loc_lat;
												 current_lng = data.post_user_data[0].loc_log;
												if (data.post_user_data[0].address == "") {
													$('#locname').text("No Location");
												} else {
													$('#locname').text(data.post_user_data[0].address);
												}

												$('#totaltags').text(data.total_tagged_users);
												
												for ( var i = 0; i < data.tagged_users.length; i++) {
													$('#taglist').append('<label style="float: left; margin: 5px; text-transform: none; text-align: center; background-color: #d3d3d3; border: 1px solid #d3d3d3; border-radius: 5px; font-size: small; padding: 2px;" data-value="'+data.tagged_users[i].taged_user_id+'">'
																			+ data.tagged_users[i].name
																			+ '</label>');
													tags.push(data.tagged_users[i].taged_user_id);
												}
												for ( var j = 0; j < data.comments_data.length; j++) {
													var mypic12 = BASE_URL
															+ data.comments_data[j].profile_pic;
													if (data.comments_data[j].profile_pic == '') {
														mypic12 = 'img/suer_profile.png';
													}
													if(ValidURL(data.comments_data[j].comment)){
													
														$('#comment_list')
														.append(
																'<li id="cmtC" data-value="'+data.comments_data[j].comment+'" style="margin-left:18px;"><div style="background:#C0C1C1;width:90%;height:1px;margin-top:3px;margin-bottom:3px;"></div><div class="ui-grid-a"  style="margin-top:8px;"><img id="mypicID" data-value="'+data.comments_data[j].user_id+'" class="ui-block-a" src="'+mypic12+'" style="width: 35px; height: 35px; border-radius: 20px;"><div class="ui-block-b" style="margin-left: 5px;"><label style="text-transform: none; font-weight: bold; font-size: small;">'
																		+ data.comments_data[j].name
																		+ '</label><p style="text-transform: none; font-size: 12px; font-weight: normal; white-space: pre-wrap;color:#009AFD;text-decoration: underline;">'
																		+ data.comments_data[j].comment
																		+ '</p></div></div></li>');
														
													}else{
														
														$('#comment_list')
														.append(
																'<li id="cmtC" data-value="'+data.comments_data[j].comment+'" style="margin-left:18px;"><div style="background:#C0C1C1;width:90%;height:1px;margin-top:3px;margin-bottom:3px;"></div><div class="ui-grid-a"  style="margin-top:8px;"><img id="mypicID" data-value="'+data.comments_data[j].user_id+'" class="ui-block-a" src="'+mypic12+'" style="width: 35px; height: 35px; border-radius: 20px;"><div class="ui-block-b" style="margin-left: 5px;"><label style="text-transform: none; font-weight: bold; font-size: small;">'
																		+ data.comments_data[j].name
																		+ '</label><p style="text-transform: none; font-size: 12px; font-weight: normal; white-space: pre-wrap;">'
																		+ data.comments_data[j].comment
																		+ '</p></div></div></li>');
												}
												}
													
//												$('#comment_list')
//												.append(
//														'<li id="cmtC" data-value="'+data.comments_data[j].user_id+'" style="margin-left:18px;"><div style="background:#C0C1C1;width:90%;height:1px;margin-top:3px;margin-bottom:3px;"></div><div class="ui-grid-a"  style="margin-top:8px;"><img class="ui-block-a" src="'+mypic12+'" style="width: 35px; height: 35px; border-radius: 20px;"><div class="ui-block-b" style="margin-left: 5px;"><label style="text-transform: none; font-weight: bold; font-size: small;">'
//																+ data.comments_data[j].name
//																+ '</label><p style="text-transform: none; font-size: 12px; font-weight: normal; white-space: pre-wrap;">'
//																+ data.comments_data[j].comment
//																+ '</p></div></div></li>');	
												
													
//												$('#comment_list #cmtC').click(function() {
//																	var mm = $(this).attr('data-value');
//																	view_profile_id = $(this).attr('data-value');
//																	$.mobile.changePage("view_user.html",{changeHash : true});
//												});
											}
											} else {
												console.log(data.data);
											}
											loading_done();
										},
										error : function(jqXhr, textStatus,
												errorThrown) {
											console.log(errorThrown);
											alertSS('Server Error');
											loading_done();
										}
									});
							
							var imgClick=false;
							
							$("#comment_list").on("click", "#mypicID", function() {
								console.log($(this).attr('data-value'));
								imgClick=true;
								var mm = $(this).attr('data-value');
								view_profile_id = $(this).attr('data-value');
								$.mobile.changePage("view_user.html",{changeHash : true});
							});
							
							$("#comment_list").on("click", "li", function() {
								console.log($(this).attr('data-value'));
								if(!imgClick){
									var mms=$(this).attr('data-value');
									if(ValidURL(mms)){
										if (mms.substring(0, 7) != "http://")
											mms = "http://" + mms;
										var ref = window.open(mms,'_blank','location=yes');
									}
								}else{
									imgClick=false;
								}

							});
							
							
							   function ValidURL(str) {
									  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
									  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
									  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
									  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
									  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
									  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
									  if(!pattern.test(str)) {
									    return false;
									  } else {
									    return true;
									  }
									}
							
							
							$.ajax({
										url : BASE_URL
												+ 'api/app/get_notifications',
										dataType : 'json',
										type : 'post',
										contentType : 'application/x-www-form-urlencoded',
										data : {
											user_id : user_id
										},
										success : function(data, textStatus,
												jQxhr) {
											console.log(JSON.stringify(data));
											if (data.status == '1') {
												$('#noti_count').css('display','');
												if(data.notification.unread==0){
													$('#noti_count').css('display','none');
												}else if(data.notification.unread > 7){
													$('#noti_count').text('7+');
												}else{
													$('#noti_count').text(data.notification.unread);
												}
												
											} else {
												alertSS(data.data);
											}
										},
										error : function(jqXhr, textStatus,
												errorThrown) {
											console.log(errorThrown);
											alertSS('Server Error');
										}
									});
							
							
						/*	
							jQuery(window).scroll(function() {
								if (jQuery(this).scrollTop() > 20) {
								    console.log('DOWN');
									jQuery('#scrollDiv').stop().animate({ bottom: '15px' });
								} else {
									console.log('UP');
								    jQuery('#scrollDiv').stop().animate({ top: '15px' });
								}
							});
						*/	
							
							
							$('#follow').click(function() {
												if ($(this).text() == 'Following') {
													$('#follow').text('Follow');
													$('#follow')
															.css('border',
																	'1px solid #43D3F7');
													$('#follow').css('color',
															'#43D3F7');
													$.ajax({
																url : BASE_URL
																		+ 'api/app/unfollow',
																dataType : 'json',
																type : 'post',
																contentType : 'application/x-www-form-urlencoded',
																data : {
																	user_id : user_id,
																	follower_id : follow_id
																},
																success : function(
																		data,
																		textStatus,
																		jQxhr) {
																	//console.log(JSON.stringify(data));
																	if (data.status == '1') {

																	} else {
																		console
																				.log(data.data);
																	}
																},
																error : function(
																		jqXhr,
																		textStatus,
																		errorThrown) {
																	console
																			.log(errorThrown);
																	alertSS('Server Error');
																}
															});
												} else {
													$('#follow').text(
															'Following');
													$('#follow')
															.css('border',
																	'1px solid #00D88E');
													$('#follow').css('color',
															'#00D88E');
													$.ajax({
																url : BASE_URL
																		+ 'api/app/add_follower',
																dataType : 'json',
																type : 'post',
																contentType : 'application/x-www-form-urlencoded',
																data : {
																	user_id : user_id,
																	follower_id : follow_id
																},
																success : function(
																		data,
																		textStatus,
																		jQxhr) {
																	//console.log(JSON.stringify(data));
																	if (data.status == '1') {

																	} else {
																		console
																				.log(data.data);
																	}
																},
																error : function(
																		jqXhr,
																		textStatus,
																		errorThrown) {
																	console
																			.log(errorThrown);
																	alertSS('Server Error');
																}
															});
												}
											});
							new_img_vid=0;
							var myname = "";
							var mypic = "";
							$.ajax({
										url : BASE_URL+'profile.php',
										dataType : 'json',
										type : 'post',
										contentType : 'application/x-www-form-urlencoded',
										data : {
											userid : user_id
										},
										success : function(data, textStatus,
												jQxhr) {
											//console.log(JSON.stringify(data));
											if (data.profile.length > 0) {
												myname = data.profile[0].user_name;
												mypic = data.profile[0].profile_pic;
											} else {
												console.log(data.data);
											}
										},
										error : function(jqXhr, textStatus,
												errorThrown) {
											console.log(errorThrown);
											alertSS('Server Error');
										}
									});

							$('#cmt_btn').click(function() {
												var msg = $('#cmt_msg').val();
												if (msg != null) {
													if (msg != "") {
														if (msg.length > 0) {
															if (mypic == BASE_URL) {
																mypic = "img/suer_profile.png";
															}
															if(ValidURL(msg)){
																$('#comment_list')
																.append(
																		'<li data-value="'+msg+'" style="margin-left:18px;"><div style="background:#C0C1C1;width:90%;height:1px;margin-top:3px;margin-bottom:3px;"></div><div class="ui-grid-a" style="margin-top:8px;"><img id="mypicID" data-value="'+user_id+'" class="ui-block-a" src="'+mypic+'"	style="width: 35px; height: 35px; border-radius: 20px;"><div class="ui-block-b" style="margin-left: 5px;"><label style="text-transform: none; font-weight: bold; font-size: small;">'
																				+ myname
																				+ '</label><p style="text-transform: none; font-size: 12px; font-weight: normal; white-space: pre-wrap;color:#009AFD;text-decoration: underline;">'
																				+ msg
																				+ '</p></div></div></li>');
															}else{
																$('#comment_list')
																.append(
																		'<li data-value="'+msg+'" style="margin-left:18px;"><div style="background:#C0C1C1;width:90%;height:1px;margin-top:3px;margin-bottom:3px;"></div><div class="ui-grid-a" style="margin-top:8px;"><img id="mypicID" data-value="'+user_id+'" class="ui-block-a" src="'+mypic+'"	style="width: 35px; height: 35px; border-radius: 20px;"><div class="ui-block-b" style="margin-left: 5px;"><label style="text-transform: none; font-weight: bold; font-size: small;">'
																				+ myname
																				+ '</label><p style="text-transform: none; font-size: 12px; font-weight: normal; white-space: pre-wrap;">'
																				+ msg
																				+ '</p></div></div></li>');
															}
														
															$('#cmt_msg').val(
																	'');
															$.ajax({
																		url : BASE_URL
																				+ 'api/app/add_comment',
																		dataType : 'json',
																		type : 'post',
																		contentType : 'application/x-www-form-urlencoded',
																		data : {
																			post_id : dashboard_id,
																			user_id : user_id,
																			comment : msg
																		},
																		success : function(
																				data,
																				textStatus,
																				jQxhr) {
																			console.log(JSON.stringify(data));
																			if (data.status == '1') {
																				console
																						.log("Sent");
																				comments_checked=comments_checked+1;
																				$('#totalcomments').text(comments_checked+ " Comments");
																			} else {
																				console
																						.log(data.data);
																			}
																		},
																		error : function(
																				jqXhr,
																				textStatus,
																				errorThrown) {
																			console
																					.log(errorThrown);
																			alertSS('Server Error');
																		}
																	});
														}
													}
												}
											});

							
							//$('#clkoption').click(function(){
							//	console.log("cas");
								
							//});
							if(temp_view_id==user_id){
								console.log("AUTOHORIZED");
								$("#edOption").append(new Option("Edit", "edit"));
								$("#edOption").append(new Option("Delete", "delete"));
							}else{
								console.log("NOT AUTH");
								/*$("#edOption option[value='Edit']").remove();
								$("#edOption option[value='Delete']").remove();
							
								$("#edOption option[value='Edit']").each(function() {
								    $(this).remove();
								});
								$("#edOption option[value='Delete']").each(function() {
								    $(this).remove();
								});*/
							}
							$("#edOption").append(new Option("Share via Facebook", "sharefb"));
							$("#edOption").append(new Option("Share via Twitter", "sharetw"));
							
							
							$('#edOption').change(function() {
										var foo = "";
										$('#edOption :selected').each(function(i, selected) {
												foo = $(selected).text();
										});
										console.log(foo);
								if(foo=='Edit'){
									if(temp_view_id==user_id){
										$.mobile.changePage("add_details.html", {
											changeHash : true
										});	
									}else{
										alertSS('Not Authorized to Update');
									}
								}else if(foo=='Delete'){
									if(temp_view_id==user_id){
									$.ajax({
										url : BASE_URL
												+ 'api/app/delete_user',
										dataType : 'json',
										type : 'post',
										contentType : 'application/x-www-form-urlencoded',
										data : {
											user_id : user_id,
											post_id : dashboard_id
										},
										success : function(
												data,
												textStatus,
												jQxhr) {
											console.log(JSON.stringify(data));
											if (data.status == '1') {
													alertSS("Deleted Successfully");
													if (dvt.prevPage.attr('id') != "add_details") {
													$.mobile.changePage(dvt.prevPage
																	.attr('id')
																	+ ".html",
															{
																changeHash : true
															});
													}else{
														$.mobile.changePage("dashboard.html",
														{
															changeHash : true
														});	
													}
											} else {
												console
														.log(data.data);
											}
										},
										error : function(
												jqXhr,
												textStatus,
												errorThrown) {
											console
													.log(errorThrown);
											alertSS('Server Error');
										}
									});
									}else{
										alertSS('Not Authorized to Delete');
									}
								}else if(foo=='Share via Facebook'){
								/*	window.plugins.socialsharing.share(cap_to_show,
									'Malibu Selfie', img_to_show,
									'http://www.malibuselfie.com');
									*/
									//alert(img_to_show1);
							openFB.init({
								appId : '211982599660381'
							});
							function FBlogin() {
								openFB.login(function(response) {
									if (response.status === 'connected') {
										window.setTimeout(fbShare, 2000);
									} else {
										alertSS('Facebook login failed');
									}
								}, {
									scope : 'email'
								});
							}
							fbShare();
							//FBlogin();
							/*window.open(
											    'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(img_to_show), 
											    'facebook-share-dialog', 
											    'width=626,height=436');
							*/
							//var links='s=100&p[images][0]='+encodeURI(img_to_show)+'&p[title]=MalibuSelfie&p[summary]=My customized summary';
							//window.open('https://www.facebook.com/sharer/sharer.php?u='+encodeURI(img_to_show), '_blank', 'location=yes');
							
								
							}else if(foo=='Share via Twitter'){
								//url : 'http://tinyurl.com/api-create.php?url='+img_to_show1,
								//alert(img_to_show1);
								$.ajax({
									url : 'http://tinyurl.com/api-create.php?url='+BASE_URL+"video/view/"+dashboard_id,
									type : 'post',
									contentType : 'application/x-www-form-urlencoded',
									success : function(data,
											textStatus, jQxhr) {
										console.log(data);
										console.log(JSON
												.stringify(data));
										if(img_to_show_type=='img'){
											window.open('https://twitter.com/intent/tweet/?url='+(data)+'&text=MalibuSelfies.com - Photo','_blank','location=yes');
										}else{
											window.open('https://twitter.com/intent/tweet/?url='+(data)+'&text=MalibuSelfies.com - Video','_blank','location=yes');											
										}

									},
									error : function(jqXhr, textStatus,
											errorThrown) {
										console.log(errorThrown);
										alertSS('Server Error');
									}
								});
							}
								$('#selectBox option[value=slect]').prop('selected', true);
								$('#edOption').val("").selectmenu("refresh", true);
							//	$("option:selected").removeAttr("selected");
							//	$('select#edOption option').removeAttr("selected");
								//$('#edOption').selectmenu("refresh", true);
							});
							
								
							function fbShare(){
								//alert('https://www.facebook.com/sharer/sharer.php?u='+encodeURI(BASE_URL+"video/view/"+dashboard_id+'/type/fb'));
								//window.open('https://www.facebook.com/sharer/sharer.php?u='+encodeURI(img_to_show1), '_blank', 'location=yes');
								window.open('https://www.facebook.com/sharer/sharer.php?u='+encodeURI(BASE_URL+"video/view/"+dashboard_id+'/type/fb'), '_blank', 'location=yes');
							}
							
							$("#totallike").click(function(){
								var bb=$(this).text();
								console.log(bb);
								if(bb=='0 Likes'){
									alertSS('No Likes');
								}else{
									$('#mainList').css('overflow-y', 'hidden');
									$('#mainList').css('position','fixed');
									$('#likesList').css('display','');
									$('#scrollDiv').css('position','absolute');
								}	
							});
							
							$('#likeclose').click(function(){
									$('#likesList').css('display','none');	
									$('#mainList').css('position','');
							});
							$('#ilike').click(function() {
								var mm = parseInt($("#totallike").text());

							if ($(this).attr('src') == 'img/ic_heart_icon.png') {
									$(this).attr('src','img/ic_heart_icon_clk.png');
												//	loading();
													$('#totallike')
															.text((mm + 1)+" Likes");
                                             // alert(user_id)
                                              //alert(dashboard_id)
													$.ajax({
																url : BASE_URL
																		+ 'add_like.php',
																dataType : 'json',
																type : 'post',
																contentType : 'application/x-www-form-urlencoded',
																data : {
																	userid : user_id,
																	post_id : dashboard_id,
                                                                    "like":1
																},
																success : function(
																		data,
																		textStatus,
																		jQxhr) {
																	//console.log(JSON.stringify(data));
																	if (data.update[0] == 'sucess' == '1') {

																	} else {
																		console
																				.log(data.data);
																	}
																	//	loading_done();
																},
																error : function(
																		jqXhr,
																		textStatus,
																		errorThrown) {
																	console
																			.log(errorThrown);
																	alertSS('Server Error');
																	//	loading_done();
																}
															});
												} else {
													$(this)
															.attr('src',
																	'img/ic_heart_icon.png');
														//loading();
													$('#totallike')
															.text((mm - 1)+" Likes");
													$.ajax({
																url : BASE_URL
																		+ 'add_like.php',
																dataType : 'json',
																type : 'post',
																contentType : 'application/x-www-form-urlencoded',
																data : {
																	userid : user_id,
																	post_id : dashboard_id,
                                                                    "like":0
																},
																success : function(
																		data,
																		textStatus,
																		jQxhr) {
																	//console.log(JSON.stringify(data));
																	if (data.status == '1') {

																	} else {
																		console
																				.log(data.data);
																	}
																	//	loading_done();
																},
																error : function(
																		jqXhr,
																		textStatus,
																		errorThrown) {
																	console
																			.log(errorThrown);
																	alertSS('Server Error');
																	//	loading_done();
																}
															});
												}
											});
						});
/*
 * Search User or your Friends and view Profile
 */
		
		$(document).on("pageshow","#search_user",function() {
							mytopmargin();
							document.removeEventListener("backbutton",back,false);
							$('#search_btn').click(function() {
								var txt = $('#search_img_vid').val();
								console.log(txt);
								search(txt);
								$('#search_img_vid').val('');
							});
							function search(txt) {
								loading();
								$.ajax({
											url : BASE_URL
													+ 'api/app/search_users',
											dataType : 'json',
											type : 'post',
											contentType : 'application/x-www-form-urlencoded',
											data : {
												search : txt
											},
											success : function(data,
													textStatus, jQxhr) {
												//console.log(JSON.stringify(data));
												if (data.status == '1') {
													user(data.data);
												} else {
													alertSS(data.data);
												}
												loading_done();
											},
											error : function(jqXhr, textStatus,
													errorThrown) {
												console.log(errorThrown);
												alertSS('Server Error');
												loading_done();
											}
										});
							}

							function user(data) {
								console.log("USER");
								$('#user_list').empty();
								var grid_item_height = '127px';
								for ( var i = 0; i < data.length; i += 3) {
									var let1 = '', let2 = '', let3 = '';
									if (i < data.length) {
										console.log(JSON.stringify(data[i]));
										console.log(BASE_URL
												+ data[i].profile_pic);
										var img = "";
										if (data[i].profile_pic == "") {
											img = "img/suer_profile.png";
										} else {
											img = BASE_URL
													+ data[i].profile_pic;
										}
										let1 = ('<div class="ui-block-a" style="background-color: transparent; width: 2%;"></div><img class="ui-block-b" id="u1" data-value="'
												+ data[i].id
												+ '" src="'
												+ img
												+ '" style="width: 31%;height: '
												+ grid_item_height + ';"><div class="ui-block-c" style="background-color: transparent; width: 1.75%;"></div>');
										if (i + 1 < data.length) {
											console.log(JSON
													.stringify(data[i + 1]));
											console.log(BASE_URL
													+ data[i].file_name);

											if (data[i + 1].profile_pic == '') {
												img = "img/suer_profile.png";
											} else {
												img = BASE_URL
														+ data[i + 1].profile_pic;
											}
											let2 = ('<img id="u2" data-value="'
													+ data[i + 1].id
													+ '" class="ui-block-d" src="'
													+ img
													+ '" style="width: 31%;height: '
													+ grid_item_height + ';"><div class="ui-block-e" style="background-color: transparent; width: 1.75%;"></div>');
											if (i + 2 < data.length) {
												console
														.log(JSON
																.stringify(data[i + 2]));
												console.log(BASE_URL
														+ data[i].file_name);
												if (data[i + 2].profile_pic == '') {
													img = "img/suer_profile.png";
												} else {
													img = BASE_URL
															+ data[i + 2].profile_pic;
												}
												let3 = ('<img id="u3" data-value="'
														+ data[i + 2].id
														+ '" class="ui-block-f" src="'
														+ img
														+ '" style="width: 31%;height: '
														+ grid_item_height + ';"><div class="ui-block-g" style="background-color: transparent; width: 1.75%;"></div>');
											}
										}
									}
									$('#user_list')
											.append(
													'<div class="ui-grid-f" style="width: 100%;height: '
															+ grid_item_height
															+ ';padding-top: 2px;padding-bottom: 2px;margin-top:5px;">'
															+ let1 + let2
															+ let3 + '</div>');
								}
								$('#user_list #u1').click(function() {
									var id = $(this).attr('data-value');
									console.log("ID>" + id);
									view_profile_id = id;
									$.mobile.changePage("view_user.html", {
										changeHash : true
									});
								});
								$('#user_list #u2').click(function() {
									var id = $(this).attr('data-value');
									console.log("ID>" + id);
									view_profile_id = id;
									$.mobile.changePage("view_user.html", {
										changeHash : true
									});
								});
								$('#user_list #u3').click(function() {
									var id = $(this).attr('data-value');
									console.log("ID>" + id);
									view_profile_id = id;
									$.mobile.changePage("view_user.html", {
										changeHash : true
									});
								});
							}
						});
		
		/*
		To view user profile and his/her posts and follow or unfollow the user
		*/

		$(document).on("pageshow","#view_user",function(ev, dvt) {
							//back button
							mytopmargin();
							document.removeEventListener("backbutton",back,false);
							console.log("the previous page was: "
									+ dvt.prevPage.attr('id'));
							$('#backC').click(
									function() {
										$.mobile.changePage(dvt.prevPage.attr('id')+ ".html", {changeHash : true});
							});
							$('#btn_accounts').css({
								'background-color' : '#00BEE9',
								'color' : '#FFFFFF'
							});
							$('#btn_settings').css({
								'background-color' : '#F2F2F2',
								'color' : '#434343'
							});
							$('#btn_friends').css({
								'background-color' : '#F2F2F2',
								'color' : '#434343'
							});
							$('#accounts').css({
								'display' : ''
							});
							$('#friends').css({
								'display' : 'none'
							});
							$('#settings').css({
								'display' : 'none'
							});

							$('#btn_friends').click(function() {
                                               //     alert(22)
								$('#btn_accounts').css({
									'background-color' : '#F2F2F2',
									'color' : '#434343'
								});
								$('#btn_settings').css({
									'background-color' : '#F2F2F2',
									'color' : '#434343'
								});
								$('#btn_friends').css({
									'background-color' : '#00BEE9',
									'color' : '#FFFFFF'
								});
								$('#accounts').css({
									'display' : 'none'
								});
								$('#friends').css({
									'display' : ''
								});
								$('#settings').css({
									'display' : 'none'
								});
							});
							$('#btn_accounts').click(function() {
								$('#btn_accounts').css({
									'background-color' : '#00BEE9',
									'color' : '#FFFFFF'
								});
								$('#btn_settings').css({
									'background-color' : '#F2F2F2',
									'color' : '#434343'
								});
								$('#btn_friends').css({
									'background-color' : '#F2F2F2',
									'color' : '#434343'
								});
								$('#accounts').css({
									'display' : ''
								});
								$('#friends').css({
									'display' : 'none'
								});
								$('#settings').css({
									'display' : 'none'
								});
							});
							$('#btn_settings').click(function() {
								$('#btn_accounts').css({
									'background-color' : '#F2F2F2',
									'color' : '#434343'
								});
								$('#btn_settings').css({
									'background-color' : '#00BEE9',
									'color' : '#FFFFFF'
								});
								$('#btn_friends').css({
									'background-color' : '#F2F2F2',
									'color' : '#434343'
								});
								$('#accounts').css({
									'display' : 'none'
								});
								$('#friends').css({
									'display' : 'none'
								});
								$('#settings').css({
									'display' : ''
								});
							});

							function accounts_data(about, email, username,
									city, sex, dob) {
                      // alert(1)
								$('#about').text(about);
								$('#email').text(email);
								$('#username').text(username);
								$('#city').text(city);
								$('#sex').text(sex);
								$('#dob').text(dob);
								
								$.ajax({
											url : BASE_URL
													+ 'api/app/get_notifications',
											dataType : 'json',
											type : 'post',
											contentType : 'application/x-www-form-urlencoded',
											data : {
												user_id : user_id
											},
											success : function(data, textStatus,
													jQxhr) {
												console.log(JSON.stringify(data));
												if (data.status == '1') {
													$('#noti_count').css('display','');
													if(data.notification.unread==0){
														$('#noti_count').css('display','none');
													}else if(data.notification.unread > 7){
														$('#noti_count').text('7+');
													}else{
														$('#noti_count').text(data.notification.unread);
													}
												} else {
													alertSS(data.data);
												}
											},
											error : function(jqXhr, textStatus,
													errorThrown) {
												console.log(errorThrown);
												alertSS('Server Error');
											}
										});
							}
							function all(data) {
								console.log("ALL");
								$('#photo_list').empty();
								var grid_item_height = '115px';
								for ( var i = 0; i < data.length; i += 3) {
									var let1 = '', let2 = '', let3 = '';
									if (i < data.length) {
										
										if (data[i].type == 'image') {
											let1 = ('<div class="ui-block-a" style="background-color: transparent; width: 2%;"></div><img id="m1" data-value="'
													+ data[i].id
													+ '" class="ui-block-b" src="'
													+ BASE_URL
													+ data[i].file_name
													+ '" style="width: 31%;height: '
													+ grid_item_height + ';"><div class="ui-block-c" style="background-color: transparent; width: 1.75%;"></div>');
										} else {
											var fl_name = data[i].file_name
													.replace("mp4", "jpg");
											console.log(fl_name);
											let1 = ('<div class="ui-block-a" style="background-color: transparent; width: 2%;"></div><img id="m1" data-value="'
													+ data[i].id
													+ '" class="ui-block-b" src="'
													+ BASE_URL
													+ fl_name
													+ '" style="width: 31%;height: '
													+ grid_item_height + ';z-index:0;"><img class="ui-block-b" src="img/ic_video_up.png" style="width:60px;height:47px;margin:0 auto;z-index:1;position:absolute;top:37px;left:9%;display:none;"><div class="ui-block-c" style="background-color: transparent; width: 1.75%;"></div>');
										}

										if (i + 1 < data.length) {
											
											if (data[i + 1].type == 'image') {
												let2 = ('<img id="m2"  data-value="'
														+ data[i + 1].id
														+ '" class="ui-block-d" src="'
														+ BASE_URL
														+ data[i + 1].file_name
														+ '" style="width: 31%;height: '
														+ grid_item_height + ';"><div class="ui-block-e" style="background-color: transparent; width: 1.75%;"></div>');
											} else {
												var fl_name = data[i + 1].file_name
														.replace("mp4", "jpg");
												console.log(fl_name);
												let2 = ('<img id="m2"  data-value="'
														+ data[i + 1].id
														+ '" class="ui-block-d" src="'
														+ BASE_URL
														+ fl_name
														+ '" style="width: 31%;height: '
														+ grid_item_height + ';"><img class="ui-block-d" src="img/ic_video_up.png" style="width:60px;height:47px;margin:0 auto;z-index:1;position:absolute;top:37px;left:42%;display:none;"><div class="ui-block-e" style="background-color: transparent; width: 1.75%;"></div>');
											}
											if (i + 2 < data.length) {
												
												
												if (data[i + 2].type == 'image') {
													let3 = ('<img  data-value="'
															+ data[i + 2].id
															+ '" id="m3" class="ui-block-f" src="'
															+ BASE_URL
															+ data[i + 2].file_name
															+ '" style="width: 31%;height: '
															+ grid_item_height + ';"><div class="ui-block-g" style="background-color: transparent; width: 1.75%;"></div>');
												} else {
													var fl_name = data[i + 2].file_name
															.replace("mp4",
																	"jpg");
													console.log(fl_name);
													let3 = ('<img  data-value="'
															+ data[i + 2].id
															+ '" id="m3" class="ui-block-f" src="'
															+ BASE_URL
															+ fl_name
															+ '" style="width: 31%;height: '
															+ grid_item_height + ';"><img class="ui-block-b" src="img/ic_video_up.png" style="width:60px;height:47px;margin:0 auto;z-index:1;position:absolute;top:37px;left:74%;display:none;"><div class="ui-block-g" style="background-color: transparent; width: 1.75%;"></div>');
												}
											}
										}
									}
									$('#photo_list')
											.append(
													'<li style="height:'+grid_item_height+';margin-top:7px;"><div class="ui-grid-f" style="width: 100%;height: '
															+ grid_item_height
															+ ';padding-top: 2px;padding-bottom: 2px;">'
															+ let1
															+ let2
															+ let3
															+ '</div></li>');
								}
								$('#photo_list #m1').click(function() {
									console.log($(this).attr('data-value'));
									dashboard_id = $(this).attr('data-value');
									$.mobile.changePage("data_view.html", {
										changeHash : true
									});
								});
								$('#photo_list #m2').click(function() {
									console.log($(this).attr('data-value'));
									dashboard_id = $(this).attr('data-value');
									$.mobile.changePage("data_view.html", {
										changeHash : true
									});
								});
								$('#photo_list #m3').click(function() {
									console.log($(this).attr('data-value'));
									dashboard_id = $(this).attr('data-value');
									$.mobile.changePage("data_view.html", {
										changeHash : true
									});
								});
							}

							
							
							$('#follow').click(function() {
										var ff = $('#follow').text();
												console.log(ff);
												if (ff == 'following') {
													$('#follow').text('follow');
													$('#follow').css('color',
															'#43D3F7');
													$('#follow')
															.css('border',
																	'1px solid #43D3F7');
													$.ajax({
																url : BASE_URL
																		+ 'api/app/unfollow',
																dataType : 'json',
																type : 'post',
																contentType : 'application/x-www-form-urlencoded',
																data : {
																	user_id : user_id,
																	follower_id : view_profile_id
																},
																success : function(
																		data,
																		textStatus,
																		jQxhr) {
																	//console.log(JSON.stringify(data));
																	if (data.status == '1') {

																	} else {
																		console
																				.log(data.data);
																	}
																},
																error : function(
																		jqXhr,
																		textStatus,
																		errorThrown) {
																	console
																			.log(errorThrown);
																	alertSS('Server Error');
																}
															});
												} else {
													$('#follow').text(
															'following');
													$('#follow')
															.css('border',
																	'1px solid #00D88E');
													$('#follow').css('color',
															'#00D88E');
													$.ajax({
																url : BASE_URL
																		+ 'api/app/add_follower',
																dataType : 'json',
																type : 'post',
																contentType : 'application/x-www-form-urlencoded',
																data : {
																	user_id : user_id,
																	follower_id : view_profile_id
																},
																success : function(
																		data,
																		textStatus,
																		jQxhr) {
																	//console.log(JSON.stringify(data));
																	if (data.status == '1') {

																	} else {
																		console
																				.log(data.data);
																	}
																},
																error : function(
																		jqXhr,
																		textStatus,
																		errorThrown) {
																	console
																			.log(errorThrown);
																	alertSS('Server Error');
																}
															});
												}
											});

							function view_user(id) {
								loading();
								$.ajax({
											url : BASE_URL
													+ 'api/app/view_user_profile',
											dataType : 'json',
											type : 'post',
											contentType : 'application/x-www-form-urlencoded',
											data : {
												user_id : user_id,
												view_user_id : id
											},
											success : function(data,
													textStatus, jQxhr) {
												console.log(JSON.stringify(data));
												if (data.status == '1') {
													if (data.data.profile_pic != '') {
														$('#profile_pic').attr('src',BASE_URL+ data.data.profile_pic);
													}
													conversation_id='';
													conversation_id=data.data.conversation_id;
													for_chat_user_id=id;
													for_chat_user_name=data.data.user_name;
													for_chat_user_pic=data.data.profile_pic;
													console.log(">>"+data.data.conversation_id);
													$("#pr_name").text(data.data.user_name);
													$('#pr_email').text(data.data.email);
													$('#posts').text(data.data.total_posts);
													$("#followings").text(data.data.total_followings);
													$("#followers").text(data.data.total_followers);
													if (data.data.is_followed == '1') {
														$('#follow').text('following');
														$('#follow').css(
																'color',
																'green');
														$('#follow')
																.css('border',
																		'1px solid green');
													}
													if (id == user_id) {
														$('#follow').css(
																'display',
																'none');
													}
													accounts_data(
															data.data.about,
															data.data.email,
															data.data.username,
															data.data.city,
															data.data.gender,
															data.data.dob);
													all(data.data.posts_data);
												} else {
													alertSS(data.data);
												}
												loading_done();
											},
											error : function(jqXhr, textStatus,
													errorThrown) {
												console.log(errorThrown);
												alertSS('Server Error');
												loading_done();
											}
										});
							}
							//view_profile_id="3";
							//user_id="1"
							if(view_profile_id==user_id){
								$('#follow').css('display','none');
							}
							view_user(view_profile_id);
						});
/*
 * View your Followers and Followings post and filter the posts
 */
		
		$(document).on("pageshow","#search",function() {
							//initial Display
							mytopmargin();
                       
                       //Ashutosh mishra11
                       var set_lang = localStorage.getItem('lang_select');
                       if(set_lang == "en_en"){
                       $("#search_text").html(lan_code.english[0].searchtext);
                       $("#btn_all").html(lan_code.english[0].btn_alltext);
                       $("#btn_photo").html(lan_code.english[0].btn_phototext);
                       $("#btn_video").html(lan_code.english[0].btn_videotext);

                       }else{
                       $("#search_text").html(lan_code.spanish[0].searchtext);
                       $("#btn_all").html(lan_code.spanish[0].btn_alltext);
                       $("#btn_photo").html(lan_code.spanish[0].btn_phototext);
                       $("#btn_video").html(lan_code.spanish[0].btn_videotext);
                       }

                       
							document.addEventListener("backbutton",back,false);
							var selected = 0;
							function initial() {
								$('#btn_all').css({
									'background-color' : '#00BEE9',
									'color' : '#FFFFFF'
								});
								$('#btn_photo').css({
									'background-color' : '#F2F2F2',
									'color' : '#434343'
								});
								$('#btn_video').css({
									'background-color' : '#F2F2F2',
									'color' : '#434343'
								});
								//	$('#all').css({
								//	'display' : ''
								//	});
								//	$('#photo').css({
								//	'display' : 'none'
								//	});
								//	$('#video').css({
								//	'display' : 'none'
								//	});
								selected = 0;
								search();
							}
							initial();

							function all(data) {
								console.log("ALL");
                       console.log("DATA Valueeeeee >>>> "+JSON.stringify(data));
								$('#not_noresult').css('display','none');
								if(data.length == 0){
									$('#not_noresult').css('display','');
								}
								$('#photo_list').empty();
								var grid_item_height = '115px';
								for ( var i = 0; i < data.length; i += 3) {
									var let1 = '', let2 = '', let3 = '';
									if (i < data.length) {
										console.log(JSON.stringify(data[i]));
										console.log(BASE_URL
												+ data[i].file_name);
										if (data[i].type == 'image') {
											let1 = ('<div class="ui-block-a" style="background-color: transparent; width: 2%;"></div><img id="mm1" data-value="'
													+ data[i].id
													+ '" class="ui-block-b" src="'
													+ BASE_URL
													+ data[i].file_name
													+ '" style="width: 31%;height: '
													+ grid_item_height + ';"><div class="ui-block-c" style="background-color: transparent; width: 1.75%;"></div>');
										} else {
											//var fl_name = data[i].file_name
													//.replace("mp4", "jpg");
											console.log(fl_name);
											let1 = ('<div class="ui-block-a" style="background-color: transparent; width: 2%;"></div>'
                                                    
                                                    +'<video style="margin-top: 18px;" width="31%" controls> <source src='
                                                    + BASE_URL+data[i].file_name
                                                    + 'type="video/mp4"></video>'

                                                    
//                                                    +'<img id="mm1" data-value="'
//                                                    + data[i].id
//                                                    + '" class="ui-block-b" src="'
//                                                    + BASE_URL
//                                                    + fl_name
                                                   // + '" style="width: 31%;height: '
													//+ grid_item_height + ';z-index:0;">
                                                    +'<img class="ui-block-b" src="img/ic_video_up.png" style="width:60px;height:47px;margin:0 auto;z-index:1;position:absolute;top:37px;left:9%;display:none;"><div class="ui-block-c" style="background-color: transparent; width: 1.75%;"></div>');
										}

										if (i + 1 < data.length) {
											console.log(JSON
													.stringify(data[i + 1]));
											console.log(BASE_URL
													+ data[i].file_name);
											if (data[i + 1].type == 'image') {
												let2 = ('<img id="mm2" data-value="'
														+ data[i + 1].id
														+ '" class="ui-block-d" src="'
														+ BASE_URL
														+ data[i + 1].file_name
														+ '" style="width: 31%;height: '
														+ grid_item_height + ';"><div class="ui-block-e" style="background-color: transparent; width: 1.75%;"></div>');
											} else {
												var fl_name = data[i + 1].file_name
														.replace("mp4", "jpg");
												console.log(fl_name);
												let2 = ('<img id="mm2" data-value="'
														+ data[i + 1].id
														+ '" class="ui-block-d" src="'
														+ BASE_URL
														+ fl_name
														+ '" style="width: 31%;height: '
														+ grid_item_height + ';"><img class="ui-block-d" src="img/ic_video_up.png" style="width:60px;height:47px;margin:0 auto;z-index:1;position:absolute;top:37px;left:42%;display:none;"><div class="ui-block-e" style="background-color: transparent; width: 1.75%;"></div>');
											}
											if (i + 2 < data.length) {
												console
														.log(JSON
																.stringify(data[i + 2]));
												console.log(BASE_URL
														+ data[i].file_name);
												if (data[i + 2].type == 'image') {
													let3 = ('<img id="mm3" data-value="'
															+ data[i + 2].id
															+ '" class="ui-block-f" src="'
															+ BASE_URL
															+ data[i].file_name
															+ '" style="width: 31%;height: '
															+ grid_item_height + ';"><div class="ui-block-g" style="background-color: transparent; width: 1.75%;"></div>');
												} else {
													//var fl_name = data[i + 2].file_name
															//.replace("mp4",
															//		"jpg");
													console.log(fl_name);
													let3 = ('<img id="mm3" data-value="'
															+ data[i + 2].id
															+ '" class="ui-block-f" src="'
															+ BASE_URL
															+ fl_name
															+ '" style="width: 31%;height: '
															+ grid_item_height + ';"><img class="ui-block-b" src="img/ic_video_up.png" style="width:60px;height:47px;margin:0 auto;z-index:1;position:absolute;top:37px;left:74%;display:none;"><div class="ui-block-g" style="background-color: transparent; width: 1.75%;"></div>');
												}
											}
										}
									}
									$('#photo_list')
											.append(
													'<li style="height:'+grid_item_height+';margin-top:5px;"><div class="ui-grid-f" style="width: 100%;height: '
															+ grid_item_height
															+ ';padding-top: 2px;padding-bottom: 2px;">'
															+ let1
															+ let2
															+ let3
															+ '</div></li>');
								}
								$('#photo_list #mm1').click(function() {
									console.log($(this).attr("data-value"));
									dashboard_id = $(this).attr('data-value');
									$.mobile.changePage("data_view.html", {
										changeHash : true
									});
								});
								$('#photo_list #mm2').click(function() {
									console.log($(this).attr("data-value"));
									dashboard_id = $(this).attr('data-value');
									$.mobile.changePage("data_view.html", {
										changeHash : true
									});
								});
								$('#photo_list #mm3').click(function() {
									console.log($(this).attr("data-value"));
									dashboard_id = $(this).attr('data-value');
									$.mobile.changePage("data_view.html", {
										changeHash : true
									});
								});
							}

							function photos(data) {
								console.log("PHOTO");
								$('#not_noresult').css('display','none');
								if(data.length==0){
									$('#not_noresult').css('display','');
								}
								$('#photo_list').empty();
								var grid_item_height = '115px';
								for ( var i = 0; i < data.length; i += 3) {
									var let1 = '', let2 = '', let3 = '';
									if (i < data.length) {
										console.log(JSON.stringify(data[i]));
										console.log(BASE_URL
												+ data[i].file_name);
											if(data[i].type=='image'){
										let1 = ('<div class="ui-block-a" style="background-color: transparent; width: 2%;"></div><img id="mm1" data-value="'
												+ data[i].id
												+ '" class="ui-block-b" src="'
												+ BASE_URL
												+ data[i].file_name
												+ '" style="width: 31%;height: '
												+ grid_item_height + ';"><div class="ui-block-c" style="background-color: transparent; width: 1.75%;"></div>');
											}

										if (i + 1 < data.length) {
											console.log(JSON
													.stringify(data[i + 1]));
											console.log(BASE_URL
													+ data[i].file_name);
											//		if(data[i+1].type=='image'){
											let2 = ('<img id="mm2" data-value="'
													+ data[i + 1].id
													+ '" class="ui-block-d" src="'
													+ BASE_URL
													+ data[i + 1].file_name
													+ '" style="width: 31%;height: '
													+ grid_item_height + ';"><div class="ui-block-e" style="background-color: transparent; width: 1.75%;"></div>');
											//	}else{
											//			var fl_name=data[i+1].file_name.replace("mp4", "jpg");
											//			console.log(fl_name);
											//			let2 = ('<img class="ui-block-d" src="'+BASE_URL+fl_name+'" style="width: 31%;height: '+grid_item_height+';"><img class="ui-block-d" src="img/ic_video_up.png" style="width:60px;height:47px;margin:0 auto;z-index:1;position:absolute;top:37px;left:42%;"><div class="ui-block-e" style="background-color: transparent; width: 1.75%;"></div>');
											//		}
											if (i + 2 < data.length) {
												console
														.log(JSON
																.stringify(data[i + 2]));
												console.log(BASE_URL
														+ data[i].file_name);
												//		if(data[i+2].type=='image'){
												let3 = ('<img id="mm3" data-value="'
														+ data[i + 2].id
														+ '" class="ui-block-f" src="'
														+ BASE_URL
														+ data[i + 2].file_name
														+ '" style="width: 31%;height: '
														+ grid_item_height + ';"><div class="ui-block-g" style="background-color: transparent; width: 1.75%;"></div>');
												//		}else{
												//			var fl_name=data[i+2].file_name.replace("mp4", "jpg");
												//			console.log(fl_name);
												//			let3 = ('<img class="ui-block-f" src="'+BASE_URL+fl_name+'" style="width: 31%;height: '+grid_item_height+';"><img class="ui-block-b" src="img/ic_video_up.png" style="width:60px;height:47px;margin:0 auto;z-index:1;position:absolute;top:37px;left:74%;"><div class="ui-block-g" style="background-color: transparent; width: 1.75%;"></div>');
												//		}
											}
										}
									}
									$('#photo_list').append(
													'<li style="height:'+grid_item_height+';margin-top:5px;"><div class="ui-grid-f" style="width: 100%;height: '
															+ grid_item_height
															+ ';padding-top: 2px;padding-bottom: 2px;">'
															+ let1
															+ let2
															+ let3
															+ '</div></li>');
								}
								$('#photo_list #mm1').click(function() {
									console.log($(this).attr("data-value"));
									dashboard_id = $(this).attr('data-value');
									$.mobile.changePage("data_view.html", {
										changeHash : true
									});
								});
								$('#photo_list #mm2').click(function() {
									console.log($(this).attr("data-value"));
									dashboard_id = $(this).attr('data-value');
									$.mobile.changePage("data_view.html", {
										changeHash : true
									});
								});
								$('#photo_list #mm3').click(function() {
									console.log($(this).attr("data-value"));
									dashboard_id = $(this).attr('data-value');
									$.mobile.changePage("data_view.html", {
										changeHash : true
									});
								});
							}

							function videos(data) {
								console.log("VIDEO");
								$('#not_noresult').css('display','none');
								if(data.length==0){
									$('#not_noresult').css('display','');
								}
								$('#photo_list').empty();
								var grid_item_height = '115px';
								for ( var i = 0; i < data.length; i += 3) {
									var let1 = '', let2 = '', let3 = '';
									if (i < data.length) {
										console.log(JSON.stringify(data[i]));
										console.log(BASE_URL
												+ data[i].file_name);
										//	if(data[i].type=='image'){
										//		let1 = ('<div class="ui-block-a" style="background-color: transparent; width: 2%;"></div><img class="ui-block-b" src="'+BASE_URL+data[i].file_name+'" style="width: 31%;height: '+grid_item_height+';"><div class="ui-block-c" style="background-color: transparent; width: 1.75%;"></div>');						
										//	}else{
										var fl_name = data[i].file_name
												.replace("mp4", "jpg");
										console.log(fl_name);
										let1 = ('<div class="ui-block-a" style="background-color: transparent; width: 2%;"></div><img id="mm1" data-value="'
												+ data[i].id
												+ '" class="ui-block-b" src="'
												+ BASE_URL
												+ fl_name
												+ '" style="width: 31%;height: '
												+ grid_item_height + ';z-index:0;"><img class="ui-block-b" src="img/ic_video_up.png" style="width:60px;height:47px;margin:0 auto;z-index:1;position:absolute;top:37px;left:9%;display:none;"><div class="ui-block-c" style="background-color: transparent; width: 1.75%;"></div>');
										//	}

										if (i + 1 < data.length) {
											console.log(JSON
													.stringify(data[i + 1]));
											console.log(BASE_URL
													+ data[i].file_name);
											//	if(data[i+1].type=='image'){
											//		let2 = ('<img class="ui-block-d" src="'+BASE_URL+data[i+1].file_name+'" style="width: 31%;height: '+grid_item_height+';"><div class="ui-block-e" style="background-color: transparent; width: 1.75%;"></div>');
											//	}else{
											var fl_name = data[i + 1].file_name
													.replace("mp4", "jpg");
											console.log(fl_name);
											let2 = ('<img id="mm2" data-value="'
													+ data[i + 1].id
													+ '" class="ui-block-d" src="'
													+ BASE_URL
													+ fl_name
													+ '" style="width: 31%;height: '
													+ grid_item_height + ';"><img class="ui-block-d" src="img/ic_video_up.png" style="width:60px;height:47px;margin:0 auto;z-index:1;position:absolute;top:37px;left:42%;display:none;"><div class="ui-block-e" style="background-color: transparent; width: 1.75%;"></div>');
											//	}
											if (i + 2 < data.length) {
												console
														.log(JSON
																.stringify(data[i + 2]));
												console.log(BASE_URL
														+ data[i].file_name);
												//		if(data[i+2].type=='image'){
												//			let3 = ('<img class="ui-block-f" src="'+BASE_URL+data[i+2].file_name+'" style="width: 31%;height: '+grid_item_height+';"><div class="ui-block-g" style="background-color: transparent; width: 1.75%;"></div>');
												//		}else{
												var fl_name = data[i + 2].file_name
														.replace("mp4", "jpg");
												console.log(fl_name);
												let3 = ('<img id="mm2" data-value="'
														+ data[i + 2].id
														+ '" class="ui-block-f" src="'
														+ BASE_URL
														+ fl_name
														+ '" style="width: 31%;height: '
														+ grid_item_height + ';"><img class="ui-block-b" src="img/ic_video_up.png" style="width:60px;height:47px;margin:0 auto;z-index:1;position:absolute;top:37px;left:74%;display:none;"><div class="ui-block-g" style="background-color: transparent; width: 1.75%;"></div>');
												//		}
											}
										}
									}
									$('#photo_list').append(
													'<li style="height:'+grid_item_height+';margin-top:5px;"><div class="ui-grid-f" style="width: 100%;height: '
															+ grid_item_height
															+ ';padding-top: 2px;padding-bottom: 2px;">'
															+ let1
															+ let2
															+ let3
															+ '</div></li>');
								}
								$('#photo_list #mm1').click(function() {
									console.log($(this).attr("data-value"));
									dashboard_id = $(this).attr('data-value');
									$.mobile.changePage("data_view.html", {
										changeHash : true
									});
								});
								$('#photo_list #mm2').click(function() {
									console.log($(this).attr("data-value"));
									dashboard_id = $(this).attr('data-value');
									$.mobile.changePage("data_view.html", {
										changeHash : true
									});
								});
								$('#photo_list #mm3').click(function() {
									console.log($(this).attr("data-value"));
									dashboard_id = $(this).attr('data-value');
									$.mobile.changePage("data_view.html", {
										changeHash : true
									});
								});
							}

							function search(txt) {
								if (selected == 2) {
									loading();
									$.ajax({
												url : BASE_URL
														+ 'api/app/get_video_files',
												dataType : 'json',
												type : 'post',
												contentType : 'application/x-www-form-urlencoded',
												data : {
													user_id : user_id
												},
												success : function(data,
														textStatus, jQxhr) {
													console.log(JSON.stringify(data));
													if (data.status == '1') {
														$('#noti_count').css('display','');
														if(data.notification.unread==0){
															$('#noti_count').css('display','none');
														}else if(data.notification.unread > 7){
															$('#noti_count').text('7+');
														}else{
															$('#noti_count').text(data.notification.unread);
														}
														videos(data.data);
														var tt = $(
																'#photo_list')
																.height();
														console.log("as>" + tt);
														$('#photo_list')
																.height(tt + 50);
													} else {
														alertSS(data.data);
													}
													loading_done();
												},
												error : function(jqXhr,
														textStatus, errorThrown) {
													console.log(errorThrown);
													alertSS('Server Error');
													loading_done();
												}
											});

								} else if (selected == 1) {
									loading();
									$.ajax({
												url : BASE_URL
														+ 'home.php',
												dataType : 'json',
												type : 'post',
												contentType : 'application/x-www-form-urlencoded',
												data : {
													user_id : user_id
												},
												success : function(data,
														textStatus, jQxhr) {
													console.log(JSON.stringify(data));
													if (data.post_data.length > 0) {
														$('#noti_count').css('display','');
//                                                        if(data.notification.unread==0){
//                                                            $('#noti_count').css('display','none');
//                                                        }else if(data.notification.unread > 7){
//                                                            $('#noti_count').text('7+');
//                                                        }else{
//                                                            $('#noti_count').text(data.notification.unread);
//                                                        }
                                           full_data = data.post_data;
														photos(full_data);
														var tt = $(
																'#photo_list')
																.height();
														console.log("as>" + tt);
														$('#photo_list')
																.height(tt + 50);
													} else {
														alertSS(data.data);
													}
													loading_done();
												},
												error : function(jqXhr,
														textStatus, errorThrown) {
													console.log(errorThrown);
													alertSS('Server Error');
													loading_done();
												}
											});
								} else {
									loading();
									$.ajax({
												url : BASE_URL
														+ 'home.php',
												dataType : 'json',
												type : 'post',
												contentType : 'application/x-www-form-urlencoded',
												data : {
													user_id : user_id
												},
												success : function(data,
														textStatus, jQxhr) {
													console.log(JSON
															.stringify(data));
													if (data.post_data.length > 0) {
														$('#noti_count').css('display','');
//                                                        if(data.notification.unread==0){
//                                                            $('#noti_count').css('display','none');
//                                                        }else if(data.notification.unread > 7){
//                                                            $('#noti_count').text('7+');
//                                                        }else{
//                                                            $('#noti_count').text(data.notification.unread);
//                                                        }
                                           full_data = data.post_data;

														all(full_data);
														var tt = $(
																'#photo_list')
																.height();
														console.log("as>" + tt);
														if (full_data.length > 0) {
															$('#photo_list')
																	.height(
																			tt + 50);
														}
													} else {
														alertSS(data.data);
													}
													loading_done();
												},
												error : function(jqXhr,
														textStatus, errorThrown) {
													console.log(errorThrown);
													alertSS('Server Error');
													loading_done();
												}
											});

								}
							}

							$('#search_btn').click(function() {
								var txt = $('#search_img_vid').val();
								console.log(txt);
								search(txt);
								$('#search_img_vid').val('');
							});

							//   3 bar button Click
							$('#btn_all').click(function() {
								$('#btn_video').css({
									'background-color' : '#F2F2F2',
									'color' : '#434343'
								});
								$('#btn_photo').css({
									'background-color' : '#F2F2F2',
									'color' : '#434343'
								});
								$('#btn_all').css({
									'background-color' : '#00BEE9',
									'color' : '#FFFFFF'
								});
								//$('#video').css({'display' : 'none'});
								//$('#all').css({'display' : ''});
								//$('#photo').css({'display' : 'none'});
								selected = 0;
								search($('#search_img_vid').val());
							});
							$('#btn_video').click(function() {
								$('#btn_video').css({
									'background-color' : '#00BEE9',
									'color' : '#FFFFFF'
								});
								$('#btn_photo').css({
									'background-color' : '#F2F2F2',
									'color' : '#434343'
								});
								$('#btn_all').css({
									'background-color' : '#F2F2F2',
									'color' : '#434343'
								});
								//$('#video').css({'display' : ''});
								//$('#all').css({'display' : 'none'});
								//$('#photo').css({'display' : 'none'});
								selected = 2;
								search($('#search_img_vid').val());
							});
							$('#btn_photo').click(function() {
								$('#btn_video').css({
									'background-color' : '#F2F2F2',
									'color' : '#434343'
								});
								$('#btn_photo').css({
									'background-color' : '#00BEE9',
									'color' : '#FFFFFF'
								});
								$('#btn_all').css({
									'background-color' : '#F2F2F2',
									'color' : '#434343'
								});
								//	$('#video').css({'display' : 'none'});
								//	$('#all').css({'display' : 'none'});
								//	$('#photo').css({'display' : ''});
								selected = 1;
								search($('#search_img_vid').val());
							});

						});

		$(document).on("pageshow","#notification",function() {
							mytopmargin();
							
                       //Ashutosh mishra11
                       var set_lang = localStorage.getItem('lang_select');
                       if(set_lang == "en_en"){
                       $("#notif_text").html(lan_code.english[0].notiftext);
                       }else{
                       $("#notif_text").html(lan_code.spanish[0].notiftext);
                       }

                       
							document.addEventListener("backbutton",back,false);
							var noti_click_check=true;
							function readD(){
								loading();
								$.ajax({
											url : BASE_URL+'notification.php',
											dataType : 'json',
											type : 'post',
											contentType : 'application/x-www-form-urlencoded',
											data : {
												userid : user_id
											},
											success : function(data, textStatus,
													jQxhr) {
												//alert(JSON.stringify(data));
												if (data.notification.length > 0) {
													$('#noti_count').css('display','');
//                                                    if(data.notification[0].unread==0){
//                                                        $('#noti_count').css('display','none');
//                                                    }else if(data.notification[0].unread > 7){
//                                                        $('#noti_count').text('7+');
//                                                    }else{
//                                                        $('#noti_count').text(data.notification[0].unread);
//                                                    }
													all(data.notification);
													
												} else {
													alertSS(data.data);
												}
												loading_done();
											},
											error : function(jqXhr, textStatus,
													errorThrown) {
												console.log(errorThrown);
												alertSS('Server Error');
												loading_done();
											}
										});
							}
							readD();
							function all(data) {
							//	alert(333)
                      // alert(JSON.stringify(data))
                       //alert(data.length)
								if(data.length==0){
									$('#not_noresult').css('display','');
								}else{
									$('#not_noresult').css('display','none');
									$('#notification_list').empty();
								}
								console.log("MMNBB>"+data.length);
								for ( var i = 0; i < data.length; i++) {
									if (data[i].user_id == user_id) {
										console.log("SAME NOTI USER"+i);
									} else {
                       //alert(77)
										var bb = "";
										if (data[i].profile_pic == "") {
											bb = "img/suer_profile.png";
										} else {
											bb = BASE_URL + data[i].profile_pic;
										}
                       bb = "img/suer_profile.png";
                      // alert(data[i].not_type)
                       
										if (data[i].not_type == "follower") {
											console.log("FOLLOW>"+data[i].is_read);
											if (data[i].is_read == '0') {
												$("#notification_list").append(
																'<div id="noti" postID="'
																		+ data[i].post_id
																		+ '" data-value="'
																		+ data[i].notification_id
																		+ '" class="ui-grid-a" style="width: 100%;padding:2% 5%;background-color:#9FC5E8;border-bottom:1px solid #808080;"><img class="ui-block-a" src="'+bb+'" style="width: 45px; height: 45px;"><div class="ui-block-b" style="margin-left: 10px; width: 80%; padding-top: 3px;"><label id="unamee" data-value="'+data[i].user_id+'"  style="color: #000000; font-size: small; font-weight: bold; text-transform: none; text-shadow: none;">'
																		+ data[i].name
																		+ '</label><label class="ptag" id="user_msg" style="width: 95%; text-transform: none; text-shadow: none; font-size: x-small; font-weight: normal; color: #747474;text-overflow: ellipsis">'
																		+ data[i].name
																		+ ' has started following you.</label></div>></div>');
											} else {
												$("#notification_list").append(
																'<div id="noti" postID="'
																		+ data[i].post_id
																		+ '" data-value="'
																		+ data[i].notification_id
																		+ '" class="ui-grid-a" style="width: 100%;padding:2% 5%;background-color:#FFFFFF;border-bottom:1px solid #808080;"><img class="ui-block-a" src="'+bb+'" style="width: 45px; height: 45px;"><div class="ui-block-b" style="margin-left: 10px; width: 80%; padding-top: 3px;"><label id="unamee" data-value="'+data[i].user_id+'" style="color: #000000; font-size: small; font-weight: bold; text-transform: none; text-shadow: none;">'
																		+ data[i].name
																		+ '</label><label class="ptag" id="user_msg" style="width: 95%; text-transform: none; text-shadow: none; font-size: x-small; font-weight: normal; color: #747474;text-overflow: ellipsis">'
																		+ data[i].name
																		+ ' has started following you.</label></div></div>');
											}

										} else {
											if (data[i].file_type == 'image') {
												console.log("IMG>"+data[i].is_read);
												if (data[i].is_read == '0') {
													$('#notification_list').append(
																	'<div id="noti" postID="'
																			+ data[i].post_id
																			+ '" data-value="'
																			+ data[i].notification_id
																			+ '" class="ui-grid-b"	style="width: 100%;padding:2% 5%;background-color:#9FC5E8;border-bottom:1px solid #808080;">	<img class="ui-block-a" src="'+bb+'"	style="width: 45px; height: 45px;">	<div class="ui-block-b"		style="margin-left: 10px; width: 60%; padding-top: 3px;"><label id="unamee" data-value="'+data[i].user_id+'" style="color: #000000; font-size: small; font-weight: bold; text-transform: none; text-shadow: none;">'
																			+ data[i].user_name
																			+ '</label><label class="ptag" id="user_msg" style="width: 95%; text-transform: none; text-shadow: none; font-size: x-small; font-weight: normal; color: #747474; text-overflow: ellipsis">'
																			+ data[i].message
																			+ '</label></div><img src="'+BASE_URL+data[i].file_name+'" class="ui-block-c" style="width: 50px;height:50px;"></div>');
												} else {
													$('#notification_list').append(
																	'<div id="noti" postID="'
																			+ data[i].post_id
																			+ '" data-value="'
																			+ data[i].notification_id
																			+ '" class="ui-grid-b"	style="width: 100%; padding:2% 5%;background-color:#FFFFFF;border-bottom:1px solid #808080;">	<img class="ui-block-a" src="'+bb+'"	style="width: 45px; height: 45px;">	<div class="ui-block-b"		style="margin-left: 10px; width: 60%; padding-top: 3px;"><label id="unamee" data-value="'+data[i].user_id+'" style="color: #000000; font-size: small; font-weight: bold; text-transform: none; text-shadow: none;">'
																			+ data[i].user_name
																			+ '</label><label class="ptag" id="user_msg" style="width: 95%; text-transform: none; text-shadow: none; font-size: x-small; font-weight: normal; color: #747474; text-overflow: ellipsis">'
																			+ data[i].message
																			+ '</label></div><img src="'+BASE_URL+data[i].file_name+'" class="ui-block-c" style="width: 50px;height:50px;"></div>');
												}
											} else {
												if(data[i].file_name!=null){
												var mm = (data[i].file_name).replace(".mp4", ".jpg");
												console.log("NM>" + mm);
												console.log("VID>"+data[i].is_read);
												if (data[i].is_read == '0') {
													$('#notification_list').append(
																	'<div id="noti" postID="'
																			+ data[i].post_id
																			+ '" data-value="'
																			+ data[i].notification_id
																			+ '" class="ui-grid-b"	style="width: 100%; padding:2% 5%;background-color:#9FC5E8;border-bottom:1px solid #808080;">	<img class="ui-block-a" src="'+bb+'"	style="width: 45px; height: 45px;">	<div class="ui-block-b"		style="margin-left: 10px; width: 60%; padding-top: 3px;"><label id="unamee" data-value="'+data[i].user_id+'" style="color: #000000; font-size: small; font-weight: bold; text-transform: none; text-shadow: none;">'
																			+ data[i].user_name
																			+ '</label><label class="ptag" id="user_msg" style="width: 95%; text-transform: none; text-shadow: none; font-size: x-small; font-weight: normal; color: #747474; text-overflow: ellipsis">'
																			+ data[i].message
																			+ '</label></div><img src="'+BASE_URL+mm+'" class="ui-block-c" style="width: 50px;height:50px;"></div>');
												} else {
													$('#notification_list').append(
																	'<div id="noti" postID="'
																			+ data[i].post_id
																			+ '" data-value="'
																			+ data[i].notification_id
																			+ '" class="ui-grid-b"	style="width: 100%; padding:2% 5%;background-color:#FFFFFF;border-bottom:1px solid #808080;">	<img class="ui-block-a" src="'+bb+'"	style="width: 45px; height: 45px;">	<div class="ui-block-b"		style="margin-left: 10px; width: 60%; padding-top: 3px;"><label id="unamee"	data-value="'+data[i].user_id+'" style="color: #000000; font-size: small; font-weight: bold; text-transform: none; text-shadow: none;">'
																			+ data[i].user_name
																			+ '</label><label class="ptag" id="user_msg" style="width: 95%; text-transform: none; text-shadow: none; font-size: x-small; font-weight: normal; color: #747474; text-overflow: ellipsis">'
																			+ data[i].message
																			+ '</label></div><img src="'+BASE_URL+mm+'" class="ui-block-c" style="width: 50px;height:50px;"></div>');
													}
												}
											}
										}
									}
								}
								
								$('#notification_list #noti').click(function() {
													
													var nm = $(this).attr('data-value');
													console.log(nm);
													var post = $(this).attr('postID');
													console.log(post);
												if(noti_click_check){
													if(post == 'undefined'){
														console.log('ffggf');
													}
													else{
													var zmm = $(this).css('background-color');
													//alertSS(hexc(zmm));													
													if ((hexc(zmm)) == '#9fc5e8') {
														$(this).css('background-color','#FFFFFF');
														readNoti(nm);

													}
														dashboard_id = post;
														$.mobile.changePage("data_view.html",{changeHash : true});
													}
												}else{
													noti_click_check=true;
													var zmm = $(this).css('background-color');
													if ((hexc(zmm)) == '#9fc5e8') {
														$(this).css('background-color','#FFFFFF');
														readNoti(nm);
													}
												}
												});
								$('#notification_list #unamee').click(function(){
									var uid2 = $(this).attr('data-value');
									console.log(uid2);
									noti_click_check=false;
									view_profile_id = uid2;
									$.mobile.changePage("view_user.html", {changeHash : true});
								});
								
							}
							
							$('#readAll').click(function(){
								loading();
								$.ajax({
									url : BASE_URL
											+ 'api/app/setasallread',
									dataType : 'json',
									type : 'post',
									contentType : 'application/x-www-form-urlencoded',
									data : {
										user_id : user_id
									},
									success : function(data,
											textStatus, jQxhr) {
										console.log(JSON.stringify(data));
										loading_done();
										if (data.status == '1') {
											readD();
										} else {
											alertSS(data.data);
										}
										//loading_done();	
									},
									error : function(jqXhr, textStatus,
											errorThrown) {
										console.log(errorThrown);
										alertSS('Server Error');
										//loading_done();
									}
								});
							});
							
							
							
							$("#notification_list").on("taphold", "#noti", tapholdHandler);
							function tapholdHandler(){
								 console.log($(this).attr('data-value'));
								 var kid=$(this).attr('data-value');
								 var mst=$(this);
								  navigator.notification.confirm(
										   "Are you sure to delete the notification?",
										    callBackFunction, // Specify a function to be called 
										    'MalibuSelfies',
										    ["Ok", "Cancel"]
										);

										function callBackFunction(b){
										  if(b == 1){
										    console.log("user said ok");
										    
										    loading();
											$.ajax({
														url : BASE_URL + 'api/app/delete_notifcation',
														dataType : 'json',
														type : 'post',
														contentType : 'application/x-www-form-urlencoded',
														data : {
															not_id: kid
														},
														success : function(data, textStatus,jQxhr) {
															console.log(JSON.stringify(data));
															loading_done();
															if (data.status == '1') {
																mst.remove(); 
																$(this).remove();
															}else{
																alertSS(data.data);
															}
														},
														error : function(jqXhr, textStatus,
																errorThrown) {
															console.log(errorThrown);
															alertSS('Server Error');
															loading_done();
														}
											});	
										    
										   
										  }
										  else {
										    console.log("user said Awesome");
										  }
										}
							}
							
							function readNoti(id) {
								//loading();
								$.ajax({
											url : BASE_URL
													+ 'api/app/read_notification',
											dataType : 'json',
											type : 'post',
											contentType : 'application/x-www-form-urlencoded',
											data : {
												no_id : id
											},
											success : function(data,
													textStatus, jQxhr) {
												console.log(JSON.stringify(data));
												if (data.status == '1') {

												} else {
													alertSS(data.data);
												}
												//loading_done();	
											},
											error : function(jqXhr, textStatus,
													errorThrown) {
												console.log(errorThrown);
												alertSS('Server Error');
												//loading_done();
											}
										});
							}
							function hexc(colorval) {
								var parts = colorval
										.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
								delete (parts[0]);
								for ( var i = 1; i <= 3; ++i) {
									parts[i] = parseInt(parts[i]).toString(16);
									if (parts[i].length == 1)
										parts[i] = '0' + parts[i];
								}
								return '#' + parts.join('');
							}
						});

		$(document).on("pageshow", "#register_login", function() {
			//mytopmargin();
			console.log("initial apage");
			document.addEventListener("backbutton",back,false);
		});

		$(document).on("pageshow","#registration",function() {
							mytopmargin();
							console.log("initial apage");
							document.removeEventListener("backbutton",back,false);
							var type = '1';
							var fb_tw_id = '0';
							var root = this;
							var ref;
							var profile_pic;
							// Twitter Login /////////////////////////////////////////////

							var oauth; // It Holds the oAuth data request
							var requestParams; // Specific param related to request
							var options = {
								consumerKey : 'CTpuMlU1DuYVuin5MT2aakyky', // YOUR Twitter CONSUMER_KEY -> Tlqpiy1LtK5SmtP7EPNvcMH8J
								consumerSecret : '3VsfqcRitjEgYqxA8Kl4g57nJSWt82XNy1cI9rJBXJT5fPvG3v', // YOUR Twitter CONSUMER_SECRET ->1DAQi9ml3t2lSDnLvYWZrUYFWOT6xvEY0WCwiKqjrBMdYfVpMo
								callbackUrl : "http://www.malibuselfies.com"
							}; // YOU have to replace it on one more Place  ->http://www.360itpro.com/                 
							var twitterKey = "twtrKey"; // This key is used for storing Information related

							var Twitter = {
								init : function() {
									// Apps storedAccessData , Apps Data in Raw format
									console.log("INIT");
									var storedAccessData, rawData = localStorage
											.getItem(twitterKey);
									// here we are going to check whether the data about user is already with us.
									if (localStorage.getItem(twitterKey) !== null) {
										// when App already knows data
										storedAccessData = JSON.parse(rawData); //JSON parsing
										//options.accessTokenKey = storedAccessData.accessTokenKey; // data will be saved when user first time signin
										options.accessTokenSecret = storedAccessData.accessTokenSecret; // data will be saved when user first first signin
										console
												.log("sdsaj>"
														+ JSON
																.stringify(storedAccessData));
										// javascript OAuth take care of everything for app we need to provide just the options
										oauth = OAuth(options);
										oauth.get('https://api.twitter.com/1.1/account/verify_credentials.json?skip_status=true',
														function(data) {
															var entry = JSON
																	.parse(data.text);
															console
																	.log("USERNAME: "
																			+ entry.screen_name);
														},
														function(data) {
															console
																	.log("ERROR: "
																			+ JSON
																					.stringify(data));
										});
									} else {
										// we have no data for save user
										oauth = OAuth(options);
										oauth.get('https://api.twitter.com/oauth/request_token',
														function(data) {
															requestParams = data.text;
															console
																	.log(data.text);
															ref = window.open(
																			'https://api.twitter.com/oauth/authorize?'
																					+ data.text,
																			'_blank',
																			'location=yes');
															ref.addEventListener('loadstart',function(event) {
																				console.log('start: '+ event.url);
															});
															ref.addEventListener('loadstop',function(event) {
																				console.log('stop: '+ event.url);
																				CTsucess(event.url);
															});
															ref.addEventListener('loaderror',function(event) {
																				console.log('error: '+ event.message);
															});
															ref.addEventListener('exit',function(event) {
																				console.log(event.type);
															});
															//cb.showWebPage('https://api.twitter.com/oauth/authorize?'+data.text); // This opens the Twitter authorization / sign in page
															//cb.onLocationChange = function(loc){ Twitter.success(loc); }; // Here will will track the change in URL of ChildBrowser
														},
														function(data) {
															console.log("ERROR: "+ data);
														});
									}
								},
								/*
								 When ChildBrowser's URL changes we will track it here.
								 We will also be acknowledged was the request is a successful or unsuccessful
								 */
								success : function(loc) {

									// Here the URL of supplied callback will Load
									console.log("MMNBBMNM>>" + loc);
									/*
									 Here Plugin will check whether the callback Url matches with the given Url
									 */
									//    if (loc.indexOf("http://www.360itpro.com/?") >= 0) {
									if (loc
											.indexOf("http://www.malibuselfies.com/?") >= 0) {
										// Parse the returned URL
										var index, verifier = '';
										var params = loc.substr(loc
												.indexOf('?') + 1);

										params = params.split('&');
										for ( var i = 0; i < params.length; i++) {
											var y = params[i].split('=');
											if (y[0] === 'oauth_verifier') {
												verifier = y[1];
											}
										}

										// Here we are going to change token for request with token for access

										/*
										 Once user has authorised us then we have to change the token for request with token of access
										here we will give data to localStorage.
										 */
										oauth.get('https://api.twitter.com/oauth/access_token?oauth_verifier='
																+ verifier
																+ '&'
																+ requestParams,
									function(data) {
													var accessParams = {};
															var qvars_tmp = data.text
																	.split('&');
															for ( var i = 0; i < qvars_tmp.length; i++) {
																var y = qvars_tmp[i]
																		.split('=');
																accessParams[y[0]] = decodeURIComponent(y[1]);
															}

															// $('#oauthStatus').html('<span style="color:green;">Success!</span>');
															// $('#stage-auth').hide();
															// $('#stage-data').show();
															oauth.setAccessToken([
																			accessParams.oauth_token,
																			accessParams.oauth_token_secret ]);

															// Saving token of access in Local_Storage
															var accessData = {};
															accessData.accessTokenKey = accessParams.oauth_token;
															accessData.accessTokenSecret = accessParams.oauth_token_secret;

															// Configuring Apps LOCAL_STORAGE
															console.log("TWITTER: Storing token key/secret in localStorage");
															localStorage
																	.setItem(
																			twitterKey,
																			JSON
																					.stringify(accessData));

															oauth.get(
																			'https://api.twitter.com/1.1/account/verify_credentials.json?skip_status=true',
																			function(
																					data) {
																				var entry = JSON
																						.parse(data.text);
																				console
																						.log("TWITTER USER: "
																								+ entry.screen_name);
																				//$("#welcome").show();
																				//document.getElementById("welcome").innerHTML="welcome " + entry.screen_name;
																				successfulLogin();
																				// Just for eg.
																				app
																						.init();
																			},
																			function(
																					data) {
																				console
																						.log("ERROR: "
																								+ data);
																			});

															// Now we have to close the child browser because everthing goes on track.

															window.plugins.childBrowser
																	.close();
														}, function(data) {
															console.log(data);

														});
									} else {
										console.log("empty>");
									}
								},
								tweet : function() {
									var storedAccessData, rawData = localStorage
											.getItem(twitterKey);

									storedAccessData = JSON.parse(rawData); // Paring Json
									options.accessTokenKey = storedAccessData.accessTokenKey; // it will be saved on first signin
									options.accessTokenSecret = storedAccessData.accessTokenSecret; // it will be save on first login

									// javascript OAuth will care of else for app we need to send only the options
									oauth = OAuth(options);
									oauth.get('https://api.twitter.com/1/account/verify_credentials.json?skip_status=true',
													function(data) {
														var entry = JSON
																.parse(data.text);
														Twitter.post();
													});
								},
								/*
								 We now have the data to tweet
								 */
								post : function() {
									var theTweet = $("#tweet").val(); // You can change it with what else you likes.

									oauth.post('https://api.twitter.com/1/statuses/update.json',
													{
														'status' : theTweet, // javascript OAuth encodes this
														'trim_user' : 'true'
													},
													function(data) {
														var entry = JSON
																.parse(data.text);
														console.log(entry);
														done();
													}, function(data) {
														console.log(data);
													});
								}
								

							}

							function done() {
								$("#tweet").val('');
							}

							function successfulLogin() {
								$("#loginBtn").hide();
								$("#logoutBtn,#tweet,#tweeter,#tweetBtn,#tweetText").show();

							}

							function logOut() {
								//localStorage.clear();
								window.localStorage.removeItem(twitterKey);
								document.getElementById("welcome").innerHTML = "Please Login to use this app";
								$("#loginBtn").show();
								$("#logoutBtn,#tweet,#tweeter,#tweetText,#tweetBtn").hide();

							}

							function CTsucess(loc) {
								// if (loc.indexOf("http://www.360itpro.com/?") >= 0) {
								if (loc.indexOf("http://www.malibuselfies.com/?") >= 0) {
									// Parse the returned URL
									var index, verifier = '';
									var params = loc
											.substr(loc.indexOf('?') + 1);

									params = params.split('&');
									for ( var i = 0; i < params.length; i++) {
										var y = params[i].split('=');
										if (y[0] === 'oauth_verifier') {
											verifier = y[1];
										}
									}
									var person={
											url:'http://malibuselfiesapp.com/malibu/app/media/user_profile/27_con_vid_1433272217.jpg'	
									};
									// Here we are going to change token for request with token for access
									//alert("sya");
									
									/*
									 Once user has authorised us then we have to change the token for request with token of access
									here we will give data to localStorage.
									 */
									loading();
									oauth.get('https://api.twitter.com/oauth/access_token?oauth_verifier='
															+ verifier + '&'
															+ requestParams,
													function(data) {
														var accessParams = {};
														var qvars_tmp = data.text
																.split('&');
														for ( var i = 0; i < qvars_tmp.length; i++) {
															var y = qvars_tmp[i]
																	.split('=');
															accessParams[y[0]] = decodeURIComponent(y[1]);
														}
														
														
														
													
														
														

														// $('#oauthStatus').html('<span style="color:green;">Success!</span>');
														// $('#stage-auth').hide();
														// $('#stage-data').show();
														oauth.setAccessToken([
																		accessParams.oauth_token,
																		accessParams.oauth_token_secret ]);

														// Saving token of access in Local_Storage
														var accessData = {};
														accessData.accessTokenKey = accessParams.oauth_token;
														accessData.accessTokenSecret = accessParams.oauth_token_secret;

														// Configuring Apps LOCAL_STORAGE
														console.log("TWITTER: Storing token key/secret in localStorage");
														// localStorage.setItem(twitterKey, JSON.stringify(accessData));
														if (ref != null) {
															ref.close();
														}
														oauth.get('https://api.twitter.com/1.1/account/verify_credentials.json?skip_status=true',
																		function(data) {

																			var entry = JSON
																					.parse(data.text);
																			console.log("TWITTER USER: "
																							+ entry.screen_name);
																			console.log(JSON
																							.stringify(data));
																			loading_done();
																			$('#username').val(entry.screen_name);
																			fb_tw_id = entry.id;
																			profile_pic = entry.profile_image_url_https;
																			console
																					.log(entry.profile_image_url_https);
																		},
																		function(data) {
																			console.log("ERROR: "+ JSON.stringify(data));
																		});

														// Now we have to close the child browser because everthing goes on track.

													}, function(data) {
														console.log(data);

													});
								} else {
									console.log("empty>");
								}

							}
							/////////////////////////////////////////////////////

							// FB Login site   //////////////////////////////
							//871285432960119
							openFB.init({
								appId : '211982599660381'
							});
							function FBlogin() {
								openFB.login(function(response) {
									if (response.status === 'connected') {
										getInfo();
									} else {
										console.log('Facebook login failed: '
												+ response.error);
									}
								}, {
									scope : 'email,public_profile'
								});
							}

							function getInfo() {
								openFB.api({
											path : '/me',
											success : function(data) {
												console.log("<><><><"
														+ JSON.stringify(data));
												console.log(data.name);
												console
														.log('http://graph.facebook.com/'
																+ data.id
																+ '/picture?width=200&height=200');
												//$('#username').val(data.name);
												//$('#email').val(data.email);
												//$('#')
												fb_tw_id = data.id;
												profile_pic = 'http://graph.facebook.com/'
														+ data.id
														+ '/picture?width=200&height=200';
												// openFB.logout(
												// 		function() {
												// 		alert('Logout successful');
												// 		},
												// 		function(){
												// 			alert(error.message);
												// 		});
											},
											error : errorHandler
										});
							}
							function errorHandler(error) {
								alertSS(error.message);
							}

							//////////////////////////////////////////////

							$('#tweet_login').click(function() {
								type = '2';
								Twitter.init();
								
							});

							$('#fb_login').click(function() {
								type = '3';
								FBlogin();
							});

                       
                       function doRegistration(){
							//$('#regBTn').click(function() {
                                               alert(345)
												//alert(fb_tw_id+"---"+type);
												var username = $('#username')
														.val();
												var email = $('#email').val();
												var password = $('#password').val();
												function ValidateEmail(email) {
													var expr = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
													return expr.test(email);
												};
												if (username == ''	|| email == '') {
													alertSS("Please enter all fields");
												} else if (!ValidateEmail(email)) {
													alertSS("Enter valid Email");
												}else if(username.charAt(0)=='0' || username.charAt(0)=='1' || username.charAt(0)=='2' || username.charAt(0)=='3' || username.charAt(0)=='4' || username.charAt(0)=='5' || username.charAt(0)=='6' || username.charAt(0)=='7' || username.charAt(0)=='8'|| username.charAt(0)=='9' ){
													alertSS("Username should starts with a character");
												}
                                                else if((type == '1')){
													if(password.length < 6){
														alertSS("Password should be 6 character or more");														
													}else{
														if (type == '2'	|| type == '3') {
															reg_user(username,
																	password,
																	email, type,
																	fb_tw_id,
																	profile_pic,
																	device.uuid);
														} else {
															console.log("dahrid");
															if (password == '') {
																alertSS("Please enter all fields");
															} else {
																console.log("INI");
																reg_user(
																		username,
																		password,
																		email,
																		type,
																		fb_tw_id,
																		profile_pic,
																		'');
															}
														}
													}
												}else if(username.length < 2){
													alertSS("Username should be 2 or more than 2 characters");
												}else {
													console.log("sadasd3223");
													if (type == '2'	|| type == '3') {
														reg_user(username,
																password,
																email, type,
																fb_tw_id,
																profile_pic,
																device.uuid);
													} else {
														console.log("dahrid");
														if (password == '') {
															alertSS("Please enter all fields");
														} else {
															console.log("INI");
															reg_user(
																	username,
																	password,
																	email,
																	type,
																	fb_tw_id,
																	profile_pic,
																	'');
														}
													}

												}
							//});
                                                                                }

							

						});

		$(document).on("pageshow","#login",function() {
							console.log("DATA>>>");
							mytopmargin();

                       var set_lang = localStorage.getItem('lang_select');
                       if(set_lang == null){
                       localStorage.setItem("lang_select", "en_en");
                       }
                       setTimeout(function(){
                       var set_lang = localStorage.getItem('lang_select');
                       if(set_lang == "en_en"){
                       $('#login_btn').html(lan_code.english[0].login)
                       $('#forgetPass').html(lan_code.english[0].Forgot_username)
                       $('#homeid').html(lan_code.english[0].home)
                                  
                       }else{
                       $('#login_btn').html(lan_code.spanish[0].login)
                       $('#forgetPass').html(lan_code.spanish[0].Forgot_username)
                       $('#homeid').html(lan_code.spanish[0].home)
                       }
                        }, 100);

                       
                       //changeLanguage();

							document.removeEventListener("backbutton",back,false);

							var type = '1';
							var fb_tw_id = '0';
							var root = this;
							var ref;
							var profile_pic;
							
							//TWITTER LOGIN
							var oauth; // It Holds the oAuth data request
							var requestParams; // Specific param related to request
							var options = {
								consumerKey : 'CTpuMlU1DuYVuin5MT2aakyky', // YOUR Twitter CONSUMER_KEY -> Tlqpiy1LtK5SmtP7EPNvcMH8J
								consumerSecret : '3VsfqcRitjEgYqxA8Kl4g57nJSWt82XNy1cI9rJBXJT5fPvG3v', // YOUR Twitter CONSUMER_SECRET ->1DAQi9ml3t2lSDnLvYWZrUYFWOT6xvEY0WCwiKqjrBMdYfVpMo
								callbackUrl : "http://www.malibuselfies.com"
							}; // YOU have to replace it on one more Place  ->http://www.360itpro.com/                 
							var twitterKey = "twtrKey"; // This key is used for storing Information related

							var Twitter = {
								init : function() {
									// Apps storedAccessData , Apps Data in Raw format
									console.log("INIT");
									var storedAccessData, rawData = localStorage
											.getItem(twitterKey);
									// here we are going to check whether the data about user is already with us.
									if (localStorage.getItem(twitterKey) !== null) {
										// when App already knows data
										storedAccessData = JSON.parse(rawData); //JSON parsing
										//options.accessTokenKey = storedAccessData.accessTokenKey; // data will be saved when user first time signin
										options.accessTokenSecret = storedAccessData.accessTokenSecret; // data will be saved when user first first signin
										console
												.log("sdsaj>"
														+ JSON
																.stringify(storedAccessData));
										// javascript OAuth take care of everything for app we need to provide just the options
										oauth = OAuth(options);
										oauth.get('https://api.twitter.com/1.1/account/verify_credentials.json?skip_status=true',
														function(data) {
															var entry = JSON
																	.parse(data.text);
															console
																	.log("USERNAME: "
																			+ entry.screen_name);
														},
														function(data) {
															console
																	.log("ERROR: "
																			+ JSON
																					.stringify(data));
										});
									} else {
										// we have no data for save user
										oauth = OAuth(options);
										oauth.get('https://api.twitter.com/oauth/request_token',
														function(data) {
															requestParams = data.text;
															console
																	.log(data.text);
															ref = window.open(
																			'https://api.twitter.com/oauth/authorize?'
																					+ data.text,
																			'_blank',
																			'location=yes');
															ref.addEventListener('loadstart',function(event) {
																				console.log('start: '+ event.url);
															});
															ref.addEventListener('loadstop',function(event) {
																				console.log('stop: '+ event.url);
																				CTsucess(event.url);
															});
															ref.addEventListener('loaderror',function(event) {
																				console.log('error: '+ event.message);
															});
															ref.addEventListener('exit',function(event) {
																				console.log(event.type);
															});
															//cb.showWebPage('https://api.twitter.com/oauth/authorize?'+data.text); // This opens the Twitter authorization / sign in page
															//cb.onLocationChange = function(loc){ Twitter.success(loc); }; // Here will will track the change in URL of ChildBrowser
														},
														function(data) {
															console.log("ERROR: "+ data);
														});
									}
								},
								/*
								 When ChildBrowser's URL changes we will track it here.
								 We will also be acknowledged was the request is a successful or unsuccessful
								 */
								success : function(loc) {

									// Here the URL of supplied callback will Load
									console.log("MMNBBMNM>>" + loc);
									/*
									 Here Plugin will check whether the callback Url matches with the given Url
									 */
									//    if (loc.indexOf("http://www.360itpro.com/?") >= 0) {
									if (loc
											.indexOf("http://www.malibuselfies.com/?") >= 0) {
										// Parse the returned URL
										var index, verifier = '';
										var params = loc.substr(loc
												.indexOf('?') + 1);

										params = params.split('&');
										for ( var i = 0; i < params.length; i++) {
											var y = params[i].split('=');
											if (y[0] === 'oauth_verifier') {
												verifier = y[1];
											}
										}

										// Here we are going to change token for request with token for access

										/*
										 Once user has authorised us then we have to change the token for request with token of access
										here we will give data to localStorage.
										 */
										oauth.get('https://api.twitter.com/oauth/access_token?oauth_verifier='
																+ verifier
																+ '&'
																+ requestParams,
									function(data) {
													var accessParams = {};
															var qvars_tmp = data.text
																	.split('&');
															for ( var i = 0; i < qvars_tmp.length; i++) {
																var y = qvars_tmp[i]
																		.split('=');
																accessParams[y[0]] = decodeURIComponent(y[1]);
															}

															// $('#oauthStatus').html('<span style="color:green;">Success!</span>');
															// $('#stage-auth').hide();
															// $('#stage-data').show();
															oauth.setAccessToken([
																			accessParams.oauth_token,
																			accessParams.oauth_token_secret ]);

															// Saving token of access in Local_Storage
															var accessData = {};
															accessData.accessTokenKey = accessParams.oauth_token;
															accessData.accessTokenSecret = accessParams.oauth_token_secret;

															// Configuring Apps LOCAL_STORAGE
															console.log("TWITTER: Storing token key/secret in localStorage");
															localStorage
																	.setItem(
																			twitterKey,
																			JSON
																					.stringify(accessData));

															oauth.get(
																			'https://api.twitter.com/1.1/account/verify_credentials.json?skip_status=true',
																			function(
																					data) {
																				var entry = JSON
																						.parse(data.text);
																				console
																						.log("TWITTER USER: "
																								+ entry.screen_name);
																				//$("#welcome").show();
																				//document.getElementById("welcome").innerHTML="welcome " + entry.screen_name;
																				successfulLogin();
																				// Just for eg.
																				app
																						.init();
																			},
																			function(
																					data) {
																				console
																						.log("ERROR: "
																								+ data);
																			});

															// Now we have to close the child browser because everthing goes on track.

															window.plugins.childBrowser
																	.close();
														}, function(data) {
															console.log(data);

														});
									} else {
										console.log("empty>");
									}
								},
								tweet : function() {
									var storedAccessData, rawData = localStorage
											.getItem(twitterKey);

									storedAccessData = JSON.parse(rawData); // Paring Json
									options.accessTokenKey = storedAccessData.accessTokenKey; // it will be saved on first signin
									options.accessTokenSecret = storedAccessData.accessTokenSecret; // it will be save on first login

									// javascript OAuth will care of else for app we need to send only the options
									oauth = OAuth(options);
									oauth.get('https://api.twitter.com/1/account/verify_credentials.json?skip_status=true',
													function(data) {
														var entry = JSON
																.parse(data.text);
														Twitter.post();
													});
								},
								/*
								 We now have the data to tweet
								 */
								post : function() {
									var theTweet = $("#tweet").val(); // You can change it with what else you likes.

									oauth.post('https://api.twitter.com/1/statuses/update.json',
													{
														'status' : theTweet, // javascript OAuth encodes this
														'trim_user' : 'true'
													},
													function(data) {
														var entry = JSON
																.parse(data.text);
														console.log(entry);
														done();
													}, function(data) {
														console.log(data);
													});
								}
								

							}

							function done() {
								$("#tweet").val('');
							}

							function successfulLogin() {
								$("#loginBtn").hide();
								$("#logoutBtn,#tweet,#tweeter,#tweetBtn,#tweetText").show();

							}

							function logOut() {
								//localStorage.clear();
								window.localStorage.removeItem(twitterKey);
								document.getElementById("welcome").innerHTML = "Please Login to use this app";
								$("#loginBtn").show();
								$("#logoutBtn,#tweet,#tweeter,#tweetText,#tweetBtn").hide();

							}

							function CTsucess(loc) {
								// if (loc.indexOf("http://www.360itpro.com/?") >= 0) {
								if (loc.indexOf("http://www.malibuselfies.com/?") >= 0) {
									// Parse the returned URL
									var index, verifier = '';
									var params = loc
											.substr(loc.indexOf('?') + 1);

									params = params.split('&');
									for ( var i = 0; i < params.length; i++) {
										var y = params[i].split('=');
										if (y[0] === 'oauth_verifier') {
											verifier = y[1];
										}
									}
									var person={
											url:'http://malibuselfiesapp.com/malibu/app/media/user_profile/27_con_vid_1433272217.jpg'	
									};
									// Here we are going to change token for request with token for access
									//alert("sya");
									
									/*
									 Once user has authorised us then we have to change the token for request with token of access
									here we will give data to localStorage.
									 */
									loading();
									oauth.get('https://api.twitter.com/oauth/access_token?oauth_verifier='
															+ verifier + '&'
															+ requestParams,
													function(data) {
														var accessParams = {};
														var qvars_tmp = data.text
																.split('&');
														for ( var i = 0; i < qvars_tmp.length; i++) {
															var y = qvars_tmp[i]
																	.split('=');
															accessParams[y[0]] = decodeURIComponent(y[1]);
														}
														
														
														
													
														
														

														// $('#oauthStatus').html('<span style="color:green;">Success!</span>');
														// $('#stage-auth').hide();
														// $('#stage-data').show();
														oauth.setAccessToken([
																		accessParams.oauth_token,
																		accessParams.oauth_token_secret ]);

														// Saving token of access in Local_Storage
														var accessData = {};
														accessData.accessTokenKey = accessParams.oauth_token;
														accessData.accessTokenSecret = accessParams.oauth_token_secret;

														// Configuring Apps LOCAL_STORAGE
														console.log("TWITTER: Storing token key/secret in localStorage");
														// localStorage.setItem(twitterKey, JSON.stringify(accessData));
														if (ref != null) {
															ref.close();
														}
														oauth.get('https://api.twitter.com/1.1/account/verify_credentials.json?skip_status=true',
																		function(data) {

																			var entry = JSON
																					.parse(data.text);
																			console.log("TWITTER USER: "
																							+ entry.screen_name);
																			console.log(JSON
																							.stringify(data));
																			loading_done();
																			//$('#username').val(entry.screen_name);
																			/////////////////////////////////////////////
																			console.log(entry.screen_name);
																			//fb_tw_id = entry.id;
																			profile_pic = entry.profile_image_url_https;
																			console
																					.log(entry.profile_image_url_https);
																			$.ajax({
																				url : BASE_URL
																						+ 'api/app/loginwith_social',
																				dataType : 'json',
																				type : 'post',
																				contentType : 'application/x-www-form-urlencoded',
																				data : {
																					login_id : entry.screen_name,
																					type : type,
																					profile_pic: profile_pic,
																					device_id : device.uuid,
																					push_id: push_id
																				},
																				success : function(
																						data,
																						textStatus,
																						jQxhr) {
																					console.log(JSON.stringify(data));

																					if (data.status == '1') {
																						$('#username').val('');
																						$('#password').val('');
																						user_id = data.data.id;
																						$.mobile.changePage("profile.html",{changeHash : true});
																					} else {
																						alertSS(data.data);
																					}
																					loading_done();
																				},
																				error : function(
																						jqXhr,
																						textStatus,
																						errorThrown) {
																					console
																							.log(errorThrown);
																					alertSS('Server Error');
																					loading_done();
																				}
																			});
																		},
																		function(data) {
																			console.log("ERROR: "+ JSON.stringify(data));
																		});

														// Now we have to close the child browser because everthing goes on track.

													}, function(data) {
														console.log(data);

													});
								} else {
									console.log("empty>");
								}

							}
							/////////////////////////////////////////////////////

							// FB Login site   //////////////////////////////
							//871285432960119
							openFB.init({
								appId : '211982599660381'
							});
							function FBlogin() {
								openFB.login(function(response) {
									if (response.status === 'connected') {
                                        //var accessToken = response.authResponse.accessToken;
										getInfo();
									} else {
										console.log('Facebook login failed: '
												+ response.error);
									}
								}, {
									scope : 'email, public_profile'
								});
							}

							function getInfo() {
								openFB.api({
											path : '/me',
                                    		//params: { "access_token": accessToken, "?fields":"name,email,gender,user_birthday,locale,bio&access_token='"+accessToken+"'" },
											success : function(data) {
												console.log("<><><><"
														+ JSON.stringify(data));

												console.log(data.name);
												console
														.log('http://graph.facebook.com/'
																+ data.id +
																+ '/picture?width=200&height=200');
												///$('#username').val(data.name);
												///$('#email').val(data.email);
												console.log("show the emali :: ", + data.email);
												//$('#')
												fb_tw_id = data.id;
												console.log(fb_tw_id);
												profile_pic = 'http://graph.facebook.com/'
														+ data.id
														+ '/picture?width=200&height=200';
												$.ajax({
													url : BASE_URL
															+ 'login_social.php',
													dataType : 'json',
													type : 'post',
													contentType : 'application/x-www-form-urlencoded',
													data : {
														login_id : data.email,
														type : type,
														profile_pic: profile_pic,
														device_id : device.uuid,
														push_id: push_id,
														fb_name: data.name,
                                                        fb_tw_id: data.id
													},
													success : function(
															data,
															textStatus,
															jQxhr) {
														console.log(JSON.stringify(data));

														if (data.register[0].status === 'success') {
															$('#username').val('');
															$('#password').val('');
															user_id = data.register[0].user_id;
															// openFB.logout(
															// 		function() {
															// 		console.log('Logout successful');
															// 		},
															// 		function(){
															// 			console.log(error.message);
															// 		});
															$.mobile.changePage("profile.html",{changeHash : true});
														} else {
															alertSS(data.data);
														}
														loading_done();
													},
													error : function(
															jqXhr,
															textStatus,
															errorThrown) {
														console
																.log(errorThrown);
														alertSS('Server Error');
														loading_done();
													}
												});
											},
											error : errorHandler
										});
							}
							function errorHandler(error) {
								alertSS(error.message);
							}

							//////////////////////////////////////////////

							$('#tweet_login').click(function() {
								type = '2';
								Twitter.init();
								
							});

							$('#fb_login').click(function() {
								type = '3';
								FBlogin();
							});

							
							
							
							$('#forgetPass').click(function() {
								$('#forgetPassDiv').css('display', '');
							});

							function ValidateEmail(email) {
								var expr = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
								return expr.test(email);
							}
							;

							$('#popclose1').click(function() {
								$('#forgetPassDiv').css('display', 'none');
							});
							$('#update_pass_btn').click(function() {
												var nm = $('#forgetemail')
														.val();
												if (nm.length == 0) {
													alertSS("Please Enter Email");
												} else if (!ValidateEmail(nm)) {
													alertSS("Enter valid Email");
												} else {
													loading();
                                                        $.ajax({
                                                               url : BASE_URL
                                                               + 'forgot_password.php',
                                                               dataType : 'json',
                                                               type : 'post',
                                                               contentType : 'application/x-www-form-urlencoded',
                                                               data : {
                                                               email : nm
                                                               },
                                                               success : function(
                                                                                  data,
                                                                                  textStatus,
                                                                                  jQxhr) {
                                                               console.log(JSON.stringify(data));
                                                               if (data.password.length > 0) {
                                                               alertSS("Email Sent");
                                                               $('#forgetemail').val('');
                                                               $('#forgetPassDiv').css('display','none');
                                                               } else {
                                                               alertSS(data.data);
                                                               }
                                                               loading_done();
                                                               },
                                                               error : function(
                                                                                jqXhr,
                                                                                textStatus,
                                                                                errorThrown) {
                                                               console
                                                               .log(errorThrown);
                                                               alertSS('Server Error');
                                                               loading_done();
                                                               }
                                                               });
												}
											});
							$('#login_btn').click(function() {

												//$.mobile.changePage("dashboard.html", {changeHash : true});

												var username = $('#username')
														.val();
												var password = $('#password')
														.val();
												console.log("ICICD>"
														+ device.uuid);
												if (username == ''
														|| password == '') {
													alertSS("Please enter all fields");
												} else {
													var login = {
														user_name : username,
														password : password,
														device_id : device.uuid,
														push_id : push_id
													};
													loading();
													$.ajax({
																url : BASE_URL
																		+ 'api/app/login_temp',
																dataType : 'json',
																type : 'post',
																contentType : 'application/x-www-form-urlencoded',
																data : login,
																success : function(
																		data,
																		textStatus,
																		jQxhr) {
																	//console.log(JSON.stringify(data));

																	if (data.status == '1') {
																		//	alert('Login Successfully');
																		$('#username').val('');
																		$('#password').val('');
																		user_id = data.data.id;
																		$.mobile.changePage("profile.html",{changeHash : true});

																	} else {
																		alertSS(data.data);
																	}
																	loading_done();
																},
																error : function(
																		jqXhr,
																		textStatus,
																		errorThrown) {
																	console
																			.log(errorThrown);
																	alertSS('Server Error');
																	loading_done();
																}
															});
												}

											});

						});
		
		/*
		Show User Profile with settings and his/her posts and list of followers and followings
		*/
		
		$(document).on("pageshow","#profile",function() {
							console.log("Profile>>>" + user_id);
							mytopmargin();
                       
                       //profile language code
                       
                       var set_lang = localStorage.getItem('lang_select');

                       setTimeout(function(){
                                  if(set_lang == "en_en"){
                                  $('#abtlable').html(lan_code.english[0].profile)
                                  $('#emaillable').html(lan_code.english[0].email)
                                  $('#namellable').html(lan_code.english[0].name)
                                  $('#citylable').html(lan_code.english[0].city)
                                  $('#sexlable').html(lan_code.english[0].sex)
                                  $('#doblable').html(lan_code.english[0].dob)
                                  $('#btn_friends').html(lan_code.english[0].friends)
                                  $('#btn_settings').html(lan_code.english[0].post)
                                  $('#btn_accounts').html(lan_code.english[0].acinfo)
                                  $('#edit_profile_btn').html(lan_code.english[0].editprof)
                                  $('#header_profile').html(lan_code.english[0].profile)
                                  }else{
                                  $('#abtlable').html(lan_code.spanish[0].profile)
                                  $('#emaillable').html(lan_code.spanish[0].email)
                                  $('#namellable').html(lan_code.spanish[0].name)
                                  $('#citylable').html(lan_code.spanish[0].city)
                                  $('#sexlable').html(lan_code.spanish[0].sex)
                                  $('#doblable').html(lan_code.spanish[0].dob)
                                  $('#btn_friends').html(lan_code.spanish[0].friends)
                                  $('#btn_settings').html(lan_code.spanish[0].post)
                                  $('#btn_accounts').html(lan_code.spanish[0].acinfo)
                                  $('#edit_profile_btn').html(lan_code.spanish[0].editprof)
                                  $('#header_profile').html(lan_code.spanish[0].profile)
                                  }
                                  }, 100);
                       
                       
                       
                       
							document.addEventListener("backbutton",back,false);
							//initial Display
							function initial() {
								var login = {
									userid : user_id
								};
								loading();
								$.ajax({
                    url : BASE_URL+'profile.php',
                    dataType : 'json',
                    type : 'post',
                    contentType : 'application/x-www-form-urlencoded',
                    data : login,
                    success : function(data,
                            textStatus, jQxhr) {
                      //  alert(JSON.stringify(data));
                        if (data.profile.length > 0) {
                                     //  alert(11)
                                       
                                    //   $("#about").text(data.profile[0].about)
                            //console.log(data.data);
                            $('#pr_name')
                                    .text(
                                            data.profile[0].user_name);
                            $('#pr_email').text(
                                    data.profile[0].email);
                            $('#posts')
                                    .text(
                                            data.post_data);
                            $('#followings')
                                    .text(
                                            data.Friends);
                            $('#followers')
                                    .text(
                                            data.followers);
                            accounts_data(
                                    data.profile[0].about,
                                    data.profile[0].email,
                                    data.profile[0].name,
                                    data.profile[0].city,
                                    data.profile[0].gender,
                                    data.profile[0].dob);
                           // all(data.data.posts_data);
                                       if (data.profile[0].profile_pic != "") {
                                       $('#profile_pic').attr("src",BASE_URL+'/'+data.profile[0].profile_pic);
                                       }
                            $('#noti_count').css('display','');
//                            if(data.profile[0].notification.unread==0){
//                                $('#noti_count').css('display','none');
//                            }else if(data.profile[0].notification.unread > 7){
//                                $('#noti_count').text('7+');
//                            }else{
//                                $('#noti_count').text(data.notification.unread);
//                            }
                            
                        } else {
                            alertSS(data.data);
                        }
                        loading_done();
                    },
                    error : function(jqXhr, textStatus,
                            errorThrown) {
                        console.log(errorThrown);
                        alertSS('Server Error');
                        loading_done();
                    }
                });

								$('#btn_accounts').css({
									'background-color' : '#00BEE9',
									'color' : '#FFFFFF'
								});
								$('#btn_settings').css({
									'background-color' : '#F2F2F2',
									'color' : '#434343'
								});
								$('#btn_friends').css({
									'background-color' : '#F2F2F2',
									'color' : '#434343'
								});
								$('#accounts').css({
									'display' : ''
								});
								$('#friends').css({
									'display' : 'none'
								});
								$('#settings').css({
									'display' : 'none'
								});

							}
							initial();

							function all(data) {
								console.log("ALL");
								$('#photo_list').empty();
								var grid_item_height = '105px';
								for ( var i = 0; i < data.length; i += 3) {
									var let1 = '', let2 = '', let3 = '';
									if (i < data.length) {
										console.log(JSON.stringify(data[i]));
										console.log(BASE_URL
												+ data[i].file_name);
										if (data[i].type == 'image') {
											let1 = ('<div class="ui-block-a" style="background-color: transparent; width: 2%;"></div><img id="m1" data-value="'
													+ data[i].id
													+ '" class="ui-block-b" src="'
													+ BASE_URL
													+ data[i].file_name
													+ '" style="width: 31%;height: '
													+ grid_item_height + ';"><div class="ui-block-c" style="background-color: transparent; width: 1.75%;"></div>');
										} else {
											var fl_name = data[i].file_name
													.replace("mp4", "jpg");
											console.log(fl_name);
											let1 = ('<div class="ui-block-a" style="background-color: transparent; width: 2%;"></div><img id="m1" data-value="'
													+ data[i].id
													+ '" class="ui-block-b" src="'
													+ BASE_URL
													+ fl_name
													+ '" style="width: 31%;height: '
													+ grid_item_height + ';z-index:0;"><img class="ui-block-b" src="img/ic_video_up.png" style="width:60px;height:47px;margin:0 auto;z-index:1;position:absolute;top:37px;left:9%;display:none;"><div class="ui-block-c" style="background-color: transparent; width: 1.75%;"></div>');
										}

										if (i + 1 < data.length) {
											console.log(JSON
													.stringify(data[i + 1]));
											console.log(BASE_URL
													+ data[i].file_name);
											if (data[i + 1].type == 'image') {
												let2 = ('<img id="m2"  data-value="'
														+ data[i + 1].id
														+ '" class="ui-block-d" src="'
														+ BASE_URL
														+ data[i + 1].file_name
														+ '" style="width: 31%;height: '
														+ grid_item_height + ';"><div class="ui-block-e" style="background-color: transparent; width: 1.75%;"></div>');
											} else {
												var fl_name = data[i + 1].file_name
														.replace("mp4", "jpg");
												console.log(fl_name);
												let2 = ('<img id="m2"  data-value="'
														+ data[i + 1].id
														+ '" class="ui-block-d" src="'
														+ BASE_URL
														+ fl_name
														+ '" style="width: 31%;height: '
														+ grid_item_height + ';"><img class="ui-block-d" src="img/ic_video_up.png" style="width:60px;height:47px;margin:0 auto;z-index:1;position:absolute;top:37px;left:42%;display:none;"><div class="ui-block-e" style="background-color: transparent; width: 1.75%;"></div>');
											}
											if (i + 2 < data.length) {
												console
														.log(JSON
																.stringify(data[i + 2]));
												console.log(BASE_URL
														+ data[i].file_name);
												if (data[i + 2].type == 'image') {
													let3 = ('<img  data-value="'
															+ data[i + 2].id
															+ '" id="m3" class="ui-block-f" src="'
															+ BASE_URL
															+ data[i + 2].file_name
															+ '" style="width: 31%;height: '
															+ grid_item_height + ';"><div class="ui-block-g" style="background-color: transparent; width: 1.75%;"></div>');
												} else {
													var fl_name = data[i + 2].file_name
															.replace("mp4",
																	"jpg");
													console.log(fl_name);
													let3 = ('<img  data-value="'
															+ data[i + 2].id
															+ '" id="m3" class="ui-block-f" src="'
															+ BASE_URL
															+ fl_name
															+ '" style="width: 31%;height: '
															+ grid_item_height + ';"><img class="ui-block-b" src="img/ic_video_up.png" style="width:60px;height:47px;margin:0 auto;z-index:1;position:absolute;top:37px;left:74%;display:none;"><div class="ui-block-g" style="background-color: transparent; width: 1.75%;"></div>');
												}
											}
										}
									}
									$('#photo_list').append(
													'<li style="height:'+grid_item_height+';margin-top:7px;"><div class="ui-grid-f" style="width: 100%;height: '
															+ grid_item_height
															+ ';padding-top: 2px;padding-bottom: 2px;">'
															+ let1
															+ let2
															+ let3
															+ '</div></li>');
								}
								$('#photo_list #m1').click(function() {
									console.log($(this).attr('data-value'));
									dashboard_id = $(this).attr('data-value');
									$.mobile.changePage("data_view.html", {
										changeHash : true
									});
								});
								$('#photo_list #m2').click(function() {
									console.log($(this).attr('data-value'));
									dashboard_id = $(this).attr('data-value');
									$.mobile.changePage("data_view.html", {
										changeHash : true
									});
								});
								$('#photo_list #m3').click(function() {
									console.log($(this).attr('data-value'));
									dashboard_id = $(this).attr('data-value');
									$.mobile.changePage("data_view.html", {
										changeHash : true
									});
								});
							}
							
							$('#tb_followers').click(function() {
								$('#tb_followers').css({'background':'#E1E1E1'});
								$('#tb_following').css({'background':'white'});
								$('#friends_list_followers').css({'display':''});
								$('#friends_list_followings').css({'display':'none'});
							});
							
							$('#tb_following').click(function() {
                                                  //   alert(1)
								$('#tb_followers').css({'background':'white'});
								$('#tb_following').css({'background':'#E1E1E1'});
								$('#friends_list_followers').css({'display':'none'});
								$('#friends_list_followings').css({'display':''});
                                                     
                                                     
                                                     var login = {
                                                     userid : user_id
                                                     };
                                                     $.ajax({
                                                            url : BASE_URL+'users.php',
                                                            dataType : 'json',
                                                            type : 'post',
                                                            contentType : 'application/x-www-form-urlencoded',
                                                            data : login,
                                                            success : function(data,
                                                                               textStatus, jQxhr) {
                                                            
                                                            //alert(JSON.stringify(data))
                                                            
                                                            //var value = "hello";
                                                            
                                                            var str = '';
                                                            
                                                            for(var i=0;i<data.all_user.length;i++){
                                                            //alert(data.all_user[i].name)
                                                            str+='<div style=" margin-top: 10px; position: relative ; margin-left: 20px">'
                                                            str+='<div><img src="img/suer_profile.png" width="40"/></div>'
                                                            str+='<div style=" position: absolute; top: 2px; left: 50px; font-size: 14px">'+data.all_user[i].name+'</div>'
                                                            str+='<div id="follower_'+data.all_user[i].id+'" style=" position: absolute; right: 0px; top: 0px; font-size: 14px; border: 1px solid #E1E1E1; padding: 5px;border-radius:5px;width:60px;" onclick="doFollowing(\''+data.all_user[i].id+'\')">Following</div>'
                                                            str+='</div>'
                                                            }
                                                           // alert(str)
                                                            
                                                            $('#friends_list_followings').html(str);
                                                            
                                                             for(var j=0;j<data.followers.length;j++){
                                                            
                                                            var fol_id = data.followers[j].follower_id;
                                                            
                                                            $('#follower_'+fol_id+'').text('Unfollow');
                                                            
                                                            }
                                                            
                                                            },
                                                            error : function(jqXhr, textStatus,
                                                                             errorThrown) {
                                                            console.log(errorThrown);
                                                            //alertSS('Server Error');
                                                            friends_list2();
                                                            }
                                                            });

                                                     
                               
                                                     
                                                     
							});
							
                       
                       
                       
//                            function friends_list() {
//                                //follow by me
//                                var login = {
//                                    user_id : user_id
//                                };
//                                $.ajax({
//                                            url : BASE_URL
//                                                    + 'api/app/get_followers',
//                                            dataType : 'json',
//                                            type : 'post',
//                                            contentType : 'application/x-www-form-urlencoded',
//                                            data : login,
//                                            success : function(data,
//                                                    textStatus, jQxhr) {
//                                                console.log(JSON.stringify(data));
//
//                                                if (data.status == '1') {
//                                                    console.log(JSON
//                                                            .stringify(data));
//                                                    //$('#friends_list_followers').append('<li data-value="asd"><label style="margin-left: 25px;font-size: small;font-weight: bold;text-transform: none;text-shadow: none;">Followers</label><div style="height:1px;width:90%;background:#A9AAAB;margin-left:10%;"></div></li>');
//                                                    if(data.data.length==0){
//                                                        $('#friends_list_followers').append('<li data-value="asd" style="z-index:0;"><label style="margin-left: 25px;font-size: small;font-weight: normal;text-transform: none;text-shadow: none;margin-top:8px;margin-bottom:5px;">No Followers</label></li>');
//                                                    }
//                                                    for ( var i = 0; i < data.data.length; i++) {
//                                                        if (data.data[i].profile_pic == '') {
//                                                            $('#friends_list_followers').append(
//                                                                            '<li data-value="'+data.data[i].user_id+'" style="z-index:0;border: none; padding: 2.5px 10px; height: 55px;margin-top:3px;margin-left:7px;"><div class="ui-grid-b" style="width: 93%; vertical-align: middle; position: relative; float: left;"><img class="ui-block-a" src="img/suer_profile.png" style="width: 50px; height: 50px; margin-left: 5px; border: 0.5px solid white; border-radius: 3px;"><label class="ui-block-b" style="color: #7D7D7D; text-transform: none; text-shadow: none; text-align: left; font-size: small; font-weight: bold; margin: 5px; padding: 5px;">'
//                                                                                    + data.data[i].name
//                                                                                    + '</label><div class="ui-block-c" style="float: right; padding: 3% 0;"><button id="btn_follow" data-value="'+data.data[i].follower_id+'" data-role="none" style="padding: 5px 2px; background-color: white; border: 1px solid #F1F1F1; font-size: x-small; font-weight: normal; text-transform: none; text-shadow: none; float: right; width: 70px; vertical-align: middle; border-radius: 4px;display:none;">Following</button></div></div></li>');
//                                                        } else {
//                                                            $('#friends_list_followers').append(
//                                                                            '<li data-value="'+data.data[i].user_id+'" style="z-index:0;border: none; padding: 2.5px 10px; height: 55px;margin-top:3px;margin-left:7px;"><div class="ui-grid-b" style="width: 93%; vertical-align: middle; position: relative; float: left;"><img class="ui-block-a" src="'+BASE_URL+data.data[i].profile_pic+'" style="width: 50px; height: 50px; margin-left: 5px; border: 0.5px solid white; border-radius: 3px;"><label class="ui-block-b" style="color: #7D7D7D; text-transform: none; text-shadow: none; text-align: left; font-size: small; font-weight: bold; margin: 5px; padding: 5px;">'
//                                                                                    + data.data[i].name
//                                                                                    + '</label><div class="ui-block-c" style="float: right; padding: 3% 0;"><button id="btn_follow" data-value="'+data.data[i].follower_id+'" data-role="none" style="padding: 5px 2px; background-color: white; border: 1px solid #F1F1F1; font-size: x-small; font-weight: normal; text-transform: none; text-shadow: none; float: right; width: 70px; vertical-align: middle; border-radius: 4px;display:none;">Following</button></div></div></li>');
//                                                        }
//                                                    }
//                                                    $('#friends_list_followers').append('<li data-value="asd" style="height:100px;"></li>');
//
//                                                    $('#friends_list_followers li').click(function() {
//                                                                        var id = $(this).attr('data-value');
//                                                                        console.log(id);
//                                                                        if(id!='asd'){
//                                                                            view_profile_id = id;
//                                                                            $.mobile.changePage("view_user.html",{changeHash : true});
//                                                                        }
//
//                                                    });
//
//                                                    $('#friends_list_followers li #btn_follow1').click(function() {
//                                                                        $.ajax({
//                                                                                    url : BASE_URL
//                                                                                            + 'api/app/add_follower',
//                                                                                    dataType : 'json',
//                                                                                    type : 'post',
//                                                                                    contentType : 'application/x-www-form-urlencoded',
//                                                                                    data : {
//                                                                                        follower_id : $(
//                                                                                                this)
//                                                                                                .attr('data-value'),
//                                                                                        user_id : user_id
//                                                                                    },
//                                                                                    success : function(
//                                                                                            data,
//                                                                                            textStatus,
//                                                                                            jQxhr) {
//                                                                                        //console.log(JSON.stringify(data));
//                                                                                        if (data.status == '1') {
//                                                                                            console
//                                                                                                    .log("DONE");
//                                                                                        } else {
//                                                                                            alertSS(data.data);
//                                                                                        }
//                                                                                    },
//                                                                                    error : function(
//                                                                                            jqXhr,
//                                                                                            textStatus,
//                                                                                            errorThrown) {
//                                                                                        console
//                                                                                                .log(errorThrown);
//                                                                                        alertSS('Server Error');
//                                                                                    }
//                                                                                });
//                                                                    });
//
//                                                    friends_list2();
//                                                } else {
//                                                    alertSS(data.data);
//                                                }
//                                            },
//                                            error : function(jqXhr, textStatus,
//                                                    errorThrown) {
//                                                console.log(errorThrown);
//                                                //alertSS('Server Error');
//                                                friends_list2();
//                                            }
//                                        });
//
//                            }

//                            function friends_list2() {
//                                // following me
//                                var login = {
//                                    user_id : user_id
//                                };
//                                $.ajax({
//                                            url : BASE_URL
//                                                    + 'api/app/get_followings',
//                                            dataType : 'json',
//                                            type : 'post',
//                                            contentType : 'application/x-www-form-urlencoded',
//                                            data : login,
//                                            success : function(data,
//                                                    textStatus, jQxhr) {
//                                                console.log(JSON.stringify(data));
//
//                                                if (data.status == '1') {
//                                                    console
//                                                            .log(data.data.length);
//                                                //    $('#friends_list').append('<li><label style="margin-let">Following</label></li>');
//                                            //    $('#friends_list_followings').append('<li data-value="asd"><label style="margin-left: 25px;font-size: small;font-weight: bold;text-transform: none;text-shadow: none;margin-top:15px;">Followings</label><div style="height:1px;width:90%;background:#A9AAAB;margin-left:10%;"></div></li>');
//                                                if(data.data.length==0){
//                                                    $('#friends_list_followings').append('<li data-value="asd"><label style="margin-left: 25px;font-size: small;font-weight: normal;text-transform: none;text-shadow: none;margin-top:8px;margin-bottom:5px;">No Followings</label></li>');
//                                                }
//                                                for ( var i = 0; i < data.data.length; i++) {
//                                                        if (data.data[i].profile_pic == '') {
//                                                            $('#friends_list_followings')
//                                                                    .append(
//                                                                            '<li data-value="'+data.data[i].follower_id+'" style="border: none; padding: 2.5px 10px; height: 55px;margin-top:3px;margin-left:7px;"><div class="ui-grid-b" style="width: 93%; vertical-align: middle; position: relative; float: left;"><img class="ui-block-a" src="img/suer_profile.png" style="width: 50px; height: 50px; margin-left: 5px; border: 0.5px solid white; border-radius: 3px;"><label class="ui-block-b" style="color: #7D7D7D; text-transform: none; text-shadow: none; text-align: left; font-size: small; font-weight: bold; margin: 5px; padding: 5px;">'
//                                                                                    + data.data[i].name
//                                                                                    + '</label><div class="ui-block-c" style="float: right; padding: 3% 0;"><button data-role="none" style="padding: 5px 2px; background-color: white; border: 1px solid #F1F1F1; font-size: x-small; font-weight: normal; text-transform: none; text-shadow: none; float: right; width: 70px; vertical-align: middle; border-radius: 4px;display:none;">Following</button></div></div></li>');
//                                                        } else {
//                                                            $('#friends_list_followings')
//                                                                    .append(
//                                                                            '<li data-value="'+data.data[i].follower_id+'" style="border: none; padding: 2.5px 10px; height: 55px;margin-top:3px;margin-left:7px;"><div class="ui-grid-b" style="width: 93%; vertical-align: middle; position: relative; float: left;"><img class="ui-block-a" src="'+BASE_URL+data.data[i].profile_pic+'" style="width: 50px; height: 50px; margin-left: 5px; border: 0.5px solid white; border-radius: 3px;"><label class="ui-block-b" style="color: #7D7D7D; text-transform: none; text-shadow: none; text-align: left; font-size: small; font-weight: bold; margin: 5px; padding: 5px;">'
//                                                                                    + data.data[i].name
//                                                                                    + '</label><div class="ui-block-c" style="float: right; padding: 3% 0;"><button data-role="none" style="padding: 5px 2px; background-color: white; border: 1px solid #F1F1F1; font-size: x-small; font-weight: normal; text-transform: none; text-shadow: none; float: right; width: 70px; vertical-align: middle; border-radius: 4px;display:none;">Following</button></div></div></li>');
//                                                        }
//                                                    }
//                                                $('#friends_list_followings').append('<li data-value="asd" style="height:100px;"></li>');
//                                                    $('#friends_list_followings li').click(function() {
//                                                                        var id = $(this).attr('data-value');
//                                                                        console.log(id);
//                                                                    if(id!='asd'){
//                                                                        view_profile_id = id;
//                                                                        $.mobile.changePage("view_user.html",{changeHash : true});
//                                                                    }
//
//                                                    });
//                                                } else {
//                                                    alertSS(data.data);
//                                                }
//                                            },
//                                            error : function(jqXhr, textStatus,
//                                                    errorThrown) {
//                                                console.log(errorThrown);
//                                                alertSS('Server Error');
//                                            }
//                                        });
//                            }

							//friends_list();

							function accounts_data(about, email, username,
									city, sex, dob) {
								$('#about').text(about);
								$('#email').text(email);
								$('#username1').text(username);
								$('#city').text(city);
								$('#sex').text(sex);
								$('#dob').text(dob);
								$('#dob').unbind();
								if (city == null || sex == null
										|| dob == '0000-00-00') {
									alertSS("Please Update your Profile!");
								}else{
									//$.mobile.changePage("dashboard.html", {
									//	changeHash : true
									//});
								}
							}
							$('#edit_profile_btn').click(function() {
								$.mobile.changePage("update_profile.html", {
									changeHash : true
								});
							});
							
							$("#update_profile").click(function() {
								$.mobile.changePage("update_profile.html", {
									changeHash : true
								});
							});
							$("#change_Password").click(function() {
								$('#popupPassword').css('display', '');
							});
							$("#report").click(function() {
								$.mobile.changePage("report.html", {
									changeHash : true
								});
							});
                       
                       
                       $("#termsCond").click(function() {
                                          $.mobile.changePage("terms.html", {
                                                              changeHash : true
                                                              });
                                          });
                       
							$("#blog").click(function() {
								alertSS("Blog Show");
							});
							$("#logout").click(function() {
												loading();
												$.ajax({
															url : BASE_URL
																	+ 'api/app/logout',
															dataType : 'json',
															type : 'post',
															contentType : 'application/x-www-form-urlencoded',
															data : {
																device_id : device.uuid
															},
															success : function(
																	data,
																	textStatus,
																	jQxhr) {
																//console.log(JSON.stringify(data));
																loading_done();
																if (data.status == '1') {
																	alertSS(data.data);
																	$.mobile.changePage("register_login.html",{changeHash : true});
																} else {
																	//alert(data.data);
																}
															},
															error : function(
																	jqXhr,
																	textStatus,
																	errorThrown) {
																console
																		.log(errorThrown);
																loading_done();
																alertSS('Server Error');
															}
														});
											});
							$("#termsCond").click(function() {
												//alert("Terms and Conditions");
                                                  $.mobile.changePage("terms.html", {
                                                                      changeHash : true
                                                                      });
											});
							$('#popclose1').click(function() {
								$('#popupPassword').css('display', 'none');
							});

							$('#update_pass_btn').click(
											function() {
												var pass = $('#passw').val();
                                                var old_pass = $('#old_passw').val();
												var confirmpass = $(
														'#confirmpassw').val();
												if (pass.length > 0
														&& confirmpass.length > 0) {
													if (pass == confirmpass) {
														console.log("Pasws Server change");
														loading();
														$.ajax({
																	url : BASE_URL
																			+ 'update_pass.php',
																	dataType : 'json',
																	type : 'post',
																	contentType : 'application/x-www-form-urlencoded',
																	data : {
																		user_id : user_id,
																		password : pass,
                                                                        old_pass:old_pass
																	},
																	success : function(
																			data,
																			textStatus,
																			jQxhr) {
																		//console.log(JSON.stringify(data));
																		if (data.profile[0] == 'sucess') {
																			alertSS("Password Updated Succesfully");
																			$('#passw').val('');
																			$('#confirmpassw').val('');
																			$('#popupPassword').css('display', 'none');
																		} else {
																			alertSS(data.profile);
																		}
																		loading_done();
																	},
																	error : function(
																			jqXhr,
																			textStatus,
																			errorThrown) {
																		console
																				.log(errorThrown);
																		alertSS('Server Error');
																		loading_done();
																	}
																});
													} else {
														alertSS("Password and Confirm Password is not Matched");
													}
												} else {
													alertSS("Please Enter All Fields");
												}
											});

							//   3 bar button Click
							if (camera_use && device.platform === 'iOS') {
								$('#friends').css({
									'padding':'8px'
								});
							}
							
							$('#btn_friends').click(function() {
                                                 //   alert(11)
								$('#btn_accounts').css({
									'background-color' : '#F2F2F2',
									'color' : '#434343'
								});
								$('#btn_settings').css({
									'background-color' : '#F2F2F2',
									'color' : '#434343'
								});
								$('#btn_friends').css({
									'background-color' : '#00BEE9',
									'color' : '#FFFFFF'
								});
								$('#accounts').css({
									'display' : 'none'
								});
								$('#friends').css({
									'display' : ''
								});
								$('#settings').css({
									'display' : 'none'
								});
                                                    
                                                    var login = {
                                                    userid : user_id
                                                    };
                                                    $.ajax({
                                                           url : BASE_URL+'follower.php',
                                                           dataType : 'json',
                                                           type : 'post',
                                                           contentType : 'application/x-www-form-urlencoded',
                                                           data : login,
                                                           success : function(data,
                                                                              textStatus, jQxhr) {
                                                           
                                                           //alert(JSON.stringify(data))
                                                           
                                                           //var value = "hello";
                                                           
                                                           var str = '';
                                                           
                                                           for(var i=0;i<data.follower.length;i++){
                                                           
                                                           str+='<div style=" margin-top: 10px; position: relative ; margin-left: 20px">'
                                                           str+='<div><img src="img/suer_profile.png" width="40"/></div>'
                                                           str+='<div style=" position: absolute; top: 2px; left: 50px; font-size: 14px">'+data.follower[i].name+'</div>'
                                                           str+='<div style=" position: absolute; right: 0px; top: 0px; font-size: 14px; border: 1px solid #E1E1E1; padding: 5px;border-radius:5px;">Follower</div>'
                                                           str+='</div>'
                                                           }
                                                           //alert(str)
                                                           $('#friends_list_followers').html(str);
                                                           
                                                           },
                                                           error : function(jqXhr, textStatus,
                                                                            errorThrown) {
                                                           console.log(errorThrown);
                                                           //alertSS('Server Error');
                                                           // friends_list2();
                                                           }
                                                           });
                                                    
                                                    
							});
							$('#btn_accounts').click(function() {
								$('#btn_accounts').css({
									'background-color' : '#00BEE9',
									'color' : '#FFFFFF'
								});
								$('#btn_settings').css({
									'background-color' : '#F2F2F2',
									'color' : '#434343'
								});
								$('#btn_friends').css({
									'background-color' : '#F2F2F2',
									'color' : '#434343'
								});
								$('#accounts').css({
									'display' : ''
								});
								$('#friends').css({
									'display' : 'none'
								});
								$('#settings').css({
									'display' : 'none'
								});
							});
							$('#btn_settings').click(function() {
								$('#btn_accounts').css({
									'background-color' : '#F2F2F2',
									'color' : '#434343'
								});
								$('#btn_settings').css({
									'background-color' : '#00BEE9',
									'color' : '#FFFFFF'
								});
								$('#btn_friends').css({
									'background-color' : '#F2F2F2',
									'color' : '#434343'
								});
								$('#accounts').css({
									'display' : 'none'
								});
								$('#friends').css({
									'display' : 'none'
								});
								$('#settings').css({
									'display' : ''
								});
							});

						});
/*
 * Used to tag friends for a single Post
 */
		
		$(document).on("pageshow", "#add_tag_friends", function() {
			mytopmargin();
			loading();
			document.removeEventListener("backbutton",back,false);
				$.ajax({
						url : BASE_URL
								+ 'api/app/get_tagging_list',
						dataType : 'json',
						type : 'post',
						contentType : 'application/x-www-form-urlencoded',
						data : {
							user_id : user_id
						},
						success : function(data, textStatus,
								jQxhr) {
							console.log(JSON.stringify(data));
							if (data.status == '1') {
								add(data.data);
							} else {
								alertSS(data.data);
							}
							loading_done();
						},
						error : function(jqXhr, textStatus,
								errorThrown) {
							console.log(errorThrown);
							alertSS('Server Error');
							loading_done();
						}
					});
				function add(data){
					for (i = 0; i < data.length; i++) {
						console
								.log(data[i].name);
						$('#tag_friends_list').append('<li data-value="'+data[i].user_id+'"  style="background: transparent;height:50px;"><div class="ui-grid-b" style="height:50px;">		<div class="ui-block-a" style="width: 15%; height: 50px;display:none;"></div>		<div class="ui-block-b"		style="width: 70%; height: 50px; line-height: 50px; text-transform: none; text-shadow: none; font-size: medium; text-align: left; color: white; padding-left: 12px;">'+data[i].name+'</div>	<img class="ui-block-c" id="imgclk"  src="img/ic_checkbox_blank.png"	style="width: 15%;height:50px;">	</div><div style="background:white;height:1px;width:80%;"></div></li>');
					}
				$('#tag_friends_list li').click(function(){
					var id=$(this).attr('data-value');
					console.log(id);
					var img=$(this).find('img');
					console.log(img.first().attr('src'));
					if(img.first().attr('src')=='img/ic_checkbox_blank.png'){
						img.first().attr('src','img/ic_checkbox.png');
						tags.push(id);
					}else{
						img.first().attr('src','img/ic_checkbox_blank.png');
						tags.splice(tags.indexOf(id),1);
					}
					//for (var i = 0; i < tags.length; i++) {
					//   console.log(tags[i]);
					//}
				});	
			}
		
		$('#finalsave').click(function(){
			for (var i = 0; i < tags.length; i++) {
				   console.log(tags[i]);
				   //finalAdd(tags[i]);
			}
			$.mobile.changePage("add_details.html",{changeHash : true});
		});		
		
				
		function finalAdd(Tag_id){
				$.ajax({
						url : BASE_URL
								+ 'api/app/tag_user',
						dataType : 'json',
						type : 'post',
						contentType : 'application/x-www-form-urlencoded',
						data : {
							user_id : user_id,
							post_id : img_temp_id,
							taged_user_id : Tag_id
						},
						success : function(
								data,
								textStatus,
								jQxhr) {
							//console.log(JSON.stringify(data));

							if (data.status == '1') {
								console
										.log("tagged");
							} else {
								console
										.log(data.data);
							}

						},
						error : function(
								jqXhr,
								textStatus,
								errorThrown) {
							console
									.log(errorThrown);
							alertSS('Server Error');
						}
					});		
		}
		});	
		
		/*
		Settings Screen
		*/
		
		$(document).on("pageshow", "#settings", function() {
			mytopmargin();
                       
             var set_lang = localStorage.getItem('lang_select');
               
                       if(set_lang == "en_en"){
                       $('#lang_spa').show();
                       $('#change_Password').html(lan_code.english[0].change_pass)
                       $('#report').html(lan_code.english[0].report)
                       $('#termsCond').html(lan_code.english[0].terms_cond)
                       $('#privacy_policy').html(lan_code.english[0].policy)
                       $('#lang_eng').html(lan_code.english[0].lan_engl)
                       $('#lang_spa').html(lan_code.english[0].lan_span)
                       $('#logout').html(lan_code.english[0].signout)
                       }else{
                       $('#lang_eng').show();
                       $('#change_Password').html(lan_code.spanish[0].change_pass)
                       $('#report').html(lan_code.spanish[0].report)
                       $('#termsCond').html(lan_code.spanish[0].terms_cond)
                       $('#privacy_policy').html(lan_code.spanish[0].policy)
                       $('#lang_eng').html(lan_code.spanish[0].lan_engl)
                       $('#lang_spa').html(lan_code.spanish[0].lan_span)
                       $('#logout').html(lan_code.spanish[0].signout)

                       }
                     
                       
        
                       
                       
			document.removeEventListener("backbutton",back,false);
			$("#change_Password").click(function() {
				$('#popupPassword').css('display', '');
			});
			$("#report").click(function() {
				$.mobile.changePage("report.html", {
					changeHash : true
				});
			});
                       
            $("#lang_eng").click(function() {
            localStorage.setItem("lang_select", "en_en");
            $.mobile.changePage("profile.html",{changeHash : true});
            alertSS("Language Changed to English");
            });

            $("#lang_spa").click(function() {
              localStorage.setItem("lang_select", "en_sp");
            $.mobile.changePage("profile.html",{changeHash : true});
            alertSS("Idioma cambiado al español");
            });
                       
                       
			$("#blog").click(function() {
				alertSS("Blog Show");
			});
			$("#logout").click(function() {
								loading();
								$.ajax({
											url : BASE_URL
													+ 'api/app/logout',
											dataType : 'json',
											type : 'post',
											contentType : 'application/x-www-form-urlencoded',
											data : {
												device_id : device.uuid
											},
											success : function(
													data,
													textStatus,
													jQxhr) {
												//console.log(JSON.stringify(data));
												loading_done();
												if (data.status == '1') {
													alertSS(data.data);
													$.mobile.changePage("register_login.html",{changeHash : true});
												} else {
													//alert(data.data);
												}
											},
											error : function(
													jqXhr,
													textStatus,
													errorThrown) {
												console
														.log(errorThrown);
												loading_done();
												alertSS('Server Error');
											}
										});
							});
			$("#termsCond").click(function() {
								//alert("Terms and Conditions");
                                  $.mobile.changePage("policy.html", {
                                                      changeHash : true
                                                      });
							});
                       
                       
                       $("#privacy_policy").click(function() {
                                             //alert("Terms and Conditions");
                                             $.mobile.changePage("terms.html", {
                                                                 changeHash : true
                                                                 });
                                             });

                       
			$('#popclose1').click(function() {
				$('#popupPassword').css('display', 'none');
			});

			$('#update_pass_btn').click(
							function() {
								var pass = $('#passw').val();
                                         var old_pass = $('#old_passw').val();
								var confirmpass = $('#confirmpassw').val();
								if(pass.length < 6 && pass.length > 0 && confirmpass.length > 0 && confirmpass.length < 6 ){
									alertSS("Password should be 6 characters or more");
								}
								else if (pass.length > 0
										&& confirmpass.length > 0) {
									if (pass == confirmpass) {
										console.log("Pasws Server change");
										loading();
										$.ajax({
													url : BASE_URL
															+ 'update_pass.php',
													dataType : 'json',
													type : 'post',
													contentType : 'application/x-www-form-urlencoded',
													data : {
														user_id : user_id,
														password : pass,
                                               old_pass:old_pass
													},
													success : function(
															data,
															textStatus,
															jQxhr) {
														//console.log(JSON.stringify(data));
														if (data.profile[0] == 'sucess') {
															alertSS("Password Updated Succesfully");
															$('#passw').val('');
															$('#confirmpassw').val('');
                                                            $('#old_passw').val('');
															$('#popupPassword').css('display', 'none');
														} else {
															alertSS(data.profile[0]);
														}
														loading_done();
													},
													error : function(
															jqXhr,
															textStatus,
															errorThrown) {
														console
																.log(errorThrown);
														alertSS('Server Error');
														loading_done();
													}
												});
									} else {
										alertSS("Password and Confirm Password is not Matched");
									}
								} else {
									alertSS("Please Enter All Fields");
								}
							});
		});	
		
		/*
		Used to report about any post or any user and its contents
		*/
		
		$(document).on("pageshow", "#report", function() {
			mytopmargin();
			document.removeEventListener("backbutton",back,false);
			$('#send_report').click(function() {
				var msg = $('#message').val();
				var sub = $('#subject').val();
				var reg = new RegExp(/[a-zA-Z]/);
				if(msg.length > 0 && !reg.test(msg)){
					alertSS('Please enter atleast one character for message');
				}else if(sub.length > 0 && !reg.test(sub)){
					alertSS('Please enter atleast one character for subject');
				}
				else if (msg.length > 0) {
					loading();
					$.ajax({
						url : BASE_URL + 'api/app/report',
						dataType : 'json',
						type : 'post',
						contentType : 'application/x-www-form-urlencoded',
						data : {
							user_id : user_id,
							subject : sub,
							message : msg
						},
						success : function(data, textStatus, jQxhr) {
							//console.log(JSON.stringify(data));
							alertSS("Report Sent Succesfully");
							$('#message').val('');
							$('#subject').val('');
							loading_done();
						},
						error : function(jqXhr, textStatus, errorThrown) {
							console.log(errorThrown);
							alertSS('Server Error');
							loading_done();
						}
					});
				} else {
					alertSS("Please write Message First!!");
				}
			});
		});

		
		/*
		Select Image or video from camera or gallery for upload
		*/
		
		$(document).on("pageshow","#camera",function() {
							mytopmargin();
                       
                       
                       //Ashutosh mishra11
                       var set_lang = localStorage.getItem('lang_select');
                       if(set_lang == "en_en"){
                       $("#selfie_text").html(lan_code.english[0].selfietext);
                       }else{
                       $("#selfie_text").html(lan_code.spanish[0].selfietext);
                       }

                       

							document.addEventListener("backbutton",back,false);
							var image = true;
							cap_to_show='';
							
							loading();
							$.ajax({
										url : BASE_URL
												+ 'api/app/get_notifications',
										dataType : 'json',
										type : 'post',
										contentType : 'application/x-www-form-urlencoded',
										data : {
											user_id : user_id
										},
										success : function(data, textStatus,
												jQxhr) {
											console.log(JSON.stringify(data));
											if (data.status == '1') {
												$('#noti_count').css('display','');
												if(data.notification.unread==0){
													$('#noti_count').css('display','none');
												}else if(data.notification.unread > 7){
													$('#noti_count').text('7+');
												}else{
													$('#noti_count').text(data.notification.unread);
												}
											} else {
												alertSS(data.data);
											}
											loading_done();
										},
										error : function(jqXhr, textStatus,
												errorThrown) {
											console.log(errorThrown);
											alertSS('Server Error');
											loading_done();
										}
									});
							
							
							
							$('#camera_ic').click(function() {
								image = true;
								console.log("ca");
								$('#popupMenu').css('display', '');
							});

							$('#video_ic').click(function() {
								console.log("ca");
								$('#popupMenu').css('display', '');
								image = false;
							});

							$('#popclose').click(function() {
								console.log("ca");
								$('#popupMenu').css('display', 'none');
							});

							$('#select_camera').click(function() {
												camera_use = true;
												if (image) {
													var options = {
														quality : 100,
														destinationType : navigator.camera.DestinationType.FILE_URI,
														sourceType : navigator.camera.PictureSourceType.CAMERA,
														targetWidth : 400,
														targetHeight : 500,
														correctOrientation : true,
														allowEdit : true,
													};
													navigator.camera.getPicture(success,function(message) {
																		console.log("Error");}, options);
												} else {
													window.plugins.videocaptureplus
															.captureVideo(
																	captureSuccess, // your success callback
																	captureError, // your error callback
																	{
																		limit : 1, // the nr of videos to record, default 1 (on iOS always 1)
																		duration: 60,
																		highquality : false, // set to true to override the default low quality setting
																	});
												}

											});

							$("#select_gallery").click(function() {
												camera_use = true;
												if (image) {
													var options = {
														quality : 100,
														destinationType : navigator.camera.DestinationType.FILE_URI,
														sourceType : navigator.camera.PictureSourceType.SAVEDPHOTOALBUM,
														allowEdit : true,
														targetWidth : 500,
														targetHeight : 500,
													};
													navigator.camera.getPicture(success,
																	function(message) {
																		console.log("Error");
																	}, options);
												} else {
													var options = {
														quality : 100,
														destinationType : navigator.camera.DestinationType.FILE_URI,
														sourceType : navigator.camera.PictureSourceType.SAVEDPHOTOALBUM,
														mediaType : Camera.MediaType.VIDEO,
														allowEdit : true,
														correctOrientation : true
													};
													navigator.camera.getPicture(successg,
																	function(message) {
																		console.log("Error");
																	}, options);
												}

											});

							function captureSuccess(mediaFiles) {
								var i, path, len;
								//           alert("succes");
								for (i = 0, len = mediaFiles.length; i < len; i += 1) {
									path = mediaFiles[i].fullPath;
									//       console.log(path);
								}
								videosrc = mediaFiles[0].fullPath;
								uploadFile(videosrc);
								//  $.mobile.changePage("add_details.html",{ changeHash: true });
								//  console.log("path-" + mediaFiles[0].fullPath);

							}
							;
							function captureError() {
								console.log('Error');
							}

							function success(imageData) {
								console.log(imageData);
								videosrc = imageData;
								$.mobile.changePage("add_effect.html", {
									changeHash : true
								});
							}
							
							
							function successg(imageData) {
								videosrc = imageData;
								console.log(imageData);
								//	  $.mobile.changePage("add_details.html",{ changeHash: true });	  
								uploadFile(videosrc);
								//window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
							}
							

							 
							function uploadFile(mediaFile) {
								loading();
								var ft = new FileTransfer();
								console.log("dfhsd>>" + mediaFile);
								path = mediaFile;
								name = 'myvideo';
								var newdate = new Date();
								var timestamp = newdate.getTime();
								var options = new FileUploadOptions();
								options.fileKey = "file_name";
								options.fileName = timestamp+"file.mp4";
								options.chunkedMode = true;
								var params = new Object();
								params.type = "video";
								params.user_id = user_id;
								options.params = params;
								ft.upload(mediaFile, BASE_URL
										+ "video.php", function(r) {
									console.log("MM>>"
											+ JSON.stringify(r.response));
									loading_done();
									var msg = JSON.parse(r.response);
									console.log("ad>" + msg.status)
									if (msg.status == 'success') {
										console.log(msg.data);
//                                        var mdata = (msg.data[0]);
//                                        console.log(mdata.id);
//                                        img_to_show = msg.baseurl
//                                                + (mdata.file_name.replace(
//                                                        '.mp4', '.jpg'));
//                                        img_to_show1 = msg.baseurl
//                                        + (mdata.file_name);
//                                        img_temp_id = mdata.id;
//                                        console.log(img_to_show + "--"
//                                                + img_temp_id);
//                                        new_img_vid=1;
                                          img_temp_id = msg.filename
										img_to_show_type='vid';
										$.mobile.changePage("add_details.html",
												{
													changeHash : true
												});
									} else {
										alertSS(msg.data);
									}
								}, function(error) {
									alertSS("Internet Error");
									loading_done();
								}, options, true);
							}
						});

		
		/*
		Add Effects to image and also frames and preview image before upload
		*/
//		$(document).on("pagebeforeshow","#add_effect",function() {
//			$('#contentimg').attr('height',width);
//			$('#contentimg').attr('width',width);
//			$('#contentimg').css({'width':width,'height':width});
//		});
		
		$(document).on("pageshow","#add_effect",function() {
							//mytopmargin();
							document.removeEventListener("backbutton",back,false);
							var width = $(window).width();
							var height = $(window).height() - 240;
							console.log(height);
							$('.ui-content').css("width", width + "px");
							$('.ui-content').css("height", height + "px");
							console.log($('.ui-content').height());
							//var frame_name='frame0.png';
							var frame_name = '';
							select_index_item = 0;
							loadimgform();
							//alert(width);
							if (camera_use && device.platform === 'iOS') {
								$("div[data-role='header']").css("padding-top", "21px");
								//$("div[data-role='main']").css("padding-top", "21px");
								//			$("div[data-role='header']").find('h3').css("margin-top","21px");
							} 
							if(width> 450){
								//$("div[data-role='header']").css("padding-top", "21px");
								var gap=($(window).height()-width-200)/2;
								$('#contentimg').attr('height',width);
								$('#contentimg').attr('width',width);
								$('#contentimg').css({'width':width,'height':width,'text-align':'center','margin-top':(gap+'px')});
								$('#frameImg').css({'width':width,'height':width,'text-align':'center','margin-top':(gap+'px')});
								$('#id_logo').css({'margin-top': '165px','margin-right':'55px'});
							}else{
								var gap=($(window).height()-width-190)/2;
								$('#contentimg').attr('height',width);
								$('#contentimg').attr('width',width);
								$('#contentimg').css({'width':width,'height':width,'text-align':'center','margin-top':(gap+'px')});
								$('#frameImg').css({'width':width,'height':width,'text-align':'center','margin-top':(gap+'px')});
								$('#id_logo').css({'margin-top': '100px','margin-right':'20px'});
								$("div[data-role='footer']").css({'height':'22.6%'});
							}
							
							if (videosrc != '') {
								$('#contentimg').attr("src", videosrc);
							} else {
								$.mobile.changePage("camera.html", {
									changeHash : true
								});
							}
							
							
							$('#contentimg').click(function(){
								//alert($(this).attr('height')+"---"+$(this).attr('width')+"--"+gap);	
								//alert(height+"--"+$(this).attr('height')+"--"+(height-$(this).attr('height')));
								//alert((height-$(this).attr('height'))+"---"+gap);
								
							});
							$('#effect_done').click(function() {
								$('#controls_center').css('display', '');
								$('#interaction').css('display', 'none');
							});

							$('#adjust').click(function() {
								$('#for_adjust').css('display', '');
								$('#for_frame').css('display', 'none');
								$('#for_settings').css('display', 'none');
							});

							$('#settings').click(function() {
								$('#for_adjust').css('display', 'none');
								$('#for_settings').css('display', '');
								$('#for_frame').css('display', 'none');
							});

							$('#frameAdd').click(function() {
								$('#for_adjust').css('display', 'none');
								$('#for_settings').css('display', 'none');
								$('#for_frame').css('display', '');
							});

							$('#frm1').click(function() {
								var src = $(this).attr('src');
								//src=src.replace('frames','realframes');
								console.log(src);
								$('#frameImg').attr('src', src);
								$('#frameImg').css('display', '');
								frame_name = src.replace('img/frames/', '');
                                             
								//frame_name = src.replace('img/realframes/','') ;
							});
							$('#frm2').click(function() {
								var src = $(this).attr('src');
								//	src=src.replace('frames','realframes');
								console.log(src.replace('img/frames/', ''));
								$('#frameImg').attr('src', src);
								$('#frameImg').css('display', '');
								frame_name = src.replace('img/frames/', '');
								//	frame_name = src.replace('img/realframes/','') ;
							});
							$('#frm3').click(function() {
								var src = $(this).attr('src');
								//src=src.replace('frames','realframes');
								console.log(src);
								$('#frameImg').attr('src', src);
								$('#frameImg').css('display', '');
								frame_name = src.replace('img/frames/', '');
								//frame_name = src.replace('img/realframes/','') ;
							});
							$('#frm4').click(function() {
								var src = $(this).attr('src');
								//src=src.replace('frames','realframes');
								console.log(src);
								$('#frameImg').attr('src', src);
								$('#frameImg').css('display', '');
								frame_name = src.replace('img/frames/', '');
								//frame_name = src.replace('img/realframes/','') ;
							});
							$('#frm5').click(function() {
								var src = $(this).attr('src');
								//src=src.replace('frames','realframes');
								console.log(src);
								$('#frameImg').attr('src', src);
								$('#frameImg').css('display', '');
								frame_name = src.replace('img/frames/', '');
								//frame_name = src.replace('img/realframes/','') ;
							});
							$('#frm6').click(function() {
								var src = $(this).attr('src');
								//src=src.replace('frames','realframes');
								console.log(src);
								$('#frameImg').attr('src', src);
								$('#frameImg').css('display', '');
								frame_name = src.replace('img/frames/', '');
								//frame_name = src.replace('img/realframes/','') ;
							});
							$('#frm7').click(function() {
								var src = $(this).attr('src');
								//src=src.replace('frames','realframes');
								console.log(src);
								$('#frameImg').attr('src', src);
								$('#frameImg').css('display', '');
								frame_name = src.replace('img/frames/', '');
								//frame_name = src.replace('img/realframes/','') ;
							});
							$('#frm8').click(function() {
								var src = $(this).attr('src');
								//src=src.replace('frames','realframes');
								console.log(src);
								$('#frameImg').attr('src', src);
								$('#frameImg').css('display', '');
								frame_name = src.replace('img/frames/', '');
								//frame_name = src.replace('img/realframes/','') ;
							});
							$('#frm9').click(function() {
								var src = $(this).attr('src');
								//src=src.replace('frames','realframes');
								console.log(src);
								$('#frameImg').attr('src', src);
								$('#frameImg').css('display', '');
								frame_name = src.replace('img/frames/', '');
								//frame_name = src.replace('img/realframes/','') ;
							});
							$('#frm10').click(function() {
								var src = $(this).attr('src');
								//src=src.replace('frames','realframes');
								console.log(src);
								$('#frameImg').attr('src', src);
								$('#frameImg').css('display', '');
								frame_name = src.replace('img/frames/', '');
								//frame_name = src.replace('img/realframes/','') ;
							});
							$('#frm0').click(function() {
								var src = $(this).attr('src');
								//src=src.replace('frames','realframes');
								console.log(src);
								$('#frameImg').attr('src', src);
								$('#frameImg').css('display', 'none');
								frame_name = '';
								//frame_name = src.replace('img/realframes/','') ;
							});
							$('#gussianblur').click(function() {
								select_effect(0);
							});

							$('#sharpen').click(function() {
								select_effect(8);
							});

							$('#sepia').click(function() {
								select_effect(7);
							});

							$('#poster').click(function() {
								select_effect(6);
							});

							$('#noise').click(function() {
								select_effect(5);
							});

							$('#greyscale').click(function() {
								select_effect(3);
							});

							$('#edges').click(function() {
								select_effect(1);
							});

							$('#emboss').click(function() {
								select_effect(2);
							});

							$('#mosiac').click(function() {
								select_effect(4);
							});

							$('#brightness').click(function() {
								select_effect(9);
							});
							function select_effect(ij) {
								$('#controls_center').css('display', 'none');
								$('#interaction').css('display', '');
								//loadimgform();
								select_index_item = ij;
								//loadcontrols();
								fiturst = false;
								// get the main image
								var img = getFilterTarget();
								//removeClasses(img);
								//flushDataAttributes(img);
								//destroyStash(img, true);
								// adjust visible control panel
								displayControls();
								console.log("load controls");
							}
							new_img_vid=1;
							$('#editImage_save').click(function() {
                                                      // myeditcanvas = "myCanvas";
                                                       
                                                       //
                                                       var element = document.getElementById("test_img");
                                                   //    alert(66)
                                                       html2canvas(element).then(function(canvas) {
                                                                             //    alert(canvas)
                                                                                 document.body.appendChild(canvas);
                                                                                 canvas.id = "h2canvas";
                                                                                 
                                                                                 window.canvas2ImagePlugin.saveImageDataToLibrary(
                                                                                                                                  function(msg) {
                                                                                                                                  //alert(msg);
                                                                            $("#chkuploadimg").remove();
                                                                                                                                  myeditcanvas = null;
                                                                                                                                  
                                                                                                                                  uploadImage("file://" +msg);
                                                                                                                                  },
                                                                                                                                  function(err) {
                                                                                                                                  console.log("err>"+ err);
                                                                                                                                  },
                                                                                                                                  document.getElementById('h2canvas'));
                                                                                 
                                                                                 
                                                                                 //var dataURL = canvas.toDataURL();
                                                                                 //alert(dataURL)
                                                                                 //uploadImage(dataURL);
                                                                                 });
                                                       return;
                                                       
												var body23 = document
														.getElementsByTagName("body")[0];
												if (myeditcanvas != null) {
													myeditcanvas.id = "chkuploadimg";
													myeditcanvas.style.display = "none";
													body23.appendChild(myeditcanvas);

													window.canvas2ImagePlugin.saveImageDataToLibrary(
																	function(msg) {
																		$("#chkuploadimg").remove();
																		myeditcanvas = null;
																		uploadImage(msg);
																	},
																	function(err) {
																		console.log("err>"+ err);
																	},
																	document.getElementById('chkuploadimg'));
												} else {
													console.log("noedit");
													uploadImage(videosrc);
												}
											});

            function uploadImage(fileURL) {
                console.log("dedede : : " + fileURL);
              //  var fileURL = fileURL.split("?")[0]
                loading();
//                                var op = new FileUploadOptions();
//                                op.fileKey = "file_name";
//                                //    op.fileName =  "sadfdsffdfdsd"+".png";
//                                var ext = mediafile.substr((mediafile
//                                        .lastIndexOf('.') + 1));
//                                console.log(ext);
//                                op.fileName = "sadfdsffdfdsd." + ext;
//                                op.mimeType = "text/plain";

                       var newdate = new Date();
                       var timestamp = newdate.getTime();

                var options = new FileUploadOptions();
                options.fileKey = "file";
                options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
                options.mimeType = "text/plain";
                var params = new Object();
                params.type = "image";
                
                //params.user_id = user_id;
                params.frame_name = frame_name;
                options.params = params;
                var up = new FileTransfer();
                up.upload(fileURL, BASE_URL
                    + "upload.php", function(r) {

                    videosrc = "";
                    console.log("MM>>"
                        + JSON.stringify(r.response));
                    var msg = JSON.parse(r.response);
                    console.log("ad>" + msg.status)
                    if (msg.status == 'success') {
//                                        console.log(msg.data);
//                                        var mdata = (msg.data[0]);
//                                        console.log(mdata.id);
//                                        img_to_show = msg.baseurl
//                                                + mdata.file_name;
//                                        img_to_show1 = msg.baseurl
//                                        + mdata.file_name;
//                                        img_temp_id = mdata.id;
//                                        console.log(img_to_show + "--"
//                                                + img_temp_id);
                        img_temp_id = msg.filename

                        loading_done();
                        img_to_show_type='img';
                        $.mobile.changePage("add_details.html",
                            {
                                changeHash : true
                            });
                    } else {
                        alertSS("Server Error");
                    }
                }, function(error) {
                    alertSS("Error");

                }, options);
            }

        });

		/*
		Used to tag friends ,set caption and add location also to share it on social media 
		same for update post
		*/
		
		$(document).on("pageshow","#add_details",function() {

							mytopmargin();
							document.removeEventListener("backbutton",back,false);

							if (navigator.geolocation) {
								function success(pos) {
									current_lng = pos.coords.longitude;
									current_lat = pos.coords.latitude;
									console.log("locss get"
											+ pos.coords.latitude);
								}
								function fail(error) {
									console.log("error 2");
								}
								// Find the users current position.  Cache the location for 5 minutes, timeout after 6 seconds
								navigator.geolocation.getCurrentPosition(
										success, fail, {
											maximumAge : 500000,
											enableHighAccuracy : true,
											timeout : 6000
										});
							}

							$('#main_img').attr("src", img_to_show);
							$('#yourCaption').val(cap_to_show);
							$('#shared').click(
									function() {
										//alert(img_to_show1);
										window.plugins.socialsharing.share($(
												'#yourCaption').val(),
												'MalibuSelfies', img_to_show1,
												'http://www.malibuselfie.com');
							});
							
							$('#fbshare').click(function(){
								//alert(img_to_show1);
								openFB.init({
									appId : '211982599660381'
								});
								function FBlogin() {
									openFB.login(function(response) {
										if (response.status === 'connected') {
											window.setTimeout(fbShare, 1000);
										} else {
											console.log('Facebook login failed: '
													+ response.error);
										}
									}, {
										scope : 'email'
									});
								}
								fbShare();
								//FBlogin();
							});
							

							$('#twshare').click(function(){
								console.log(img_to_show);
								//alert(img_to_show1);
								$.ajax({
									url : 'http://tinyurl.com/api-create.php?url='+img_to_show1,
									type : 'post',
									contentType : 'application/x-www-form-urlencoded',
									success : function(data,
											textStatus, jQxhr) {
										console.log(data);
										console.log(JSON
												.stringify(data));
										if(img_to_show_type=='img'){
											window.open('https://twitter.com/intent/tweet/?url='+(data)+'&text=MalibuSelfies.com - Photo ','_blank','location=yes');
										}else{
											window.open('https://twitter.com/intent/tweet/?url='+(data)+'&text=MalibuSelfies.com - Video ','_blank','location=yes');											
										}

									},
									error : function(jqXhr, textStatus,
											errorThrown) {
										console.log(errorThrown);
										alertSS('Server Error');
									}
								});
							});
							
							function fbShare(){
								//alert(img_to_show1);
								window.open('https://www.facebook.com/sharer/sharer.php?u='+encodeURI(BASE_URL+"video/view/"+img_temp_id+'/type/fb'), '_blank', 'location=yes');
							}
							
							
							//	tag_friends_list
							loading();
							$.ajax({
										url : BASE_URL
												+ 'api/app/get_tagging_list',
										dataType : 'json',
										type : 'post',
										contentType : 'application/x-www-form-urlencoded',
										data : {
											user_id : user_id
										},
										success : function(data, textStatus,
												jQxhr) {
											//console.log(JSON.stringify(data));

											if (data.status == '1') {
												for (i = 0; i < data.data.length; i++) {
													console.log(data.data[i].name);
													//$('tag_friends_list').append('<option value="'+data.data[i].user_id+'">'+data.data[i].name+'</option>');
													$('#tag_friends_list').append($('<option>',
																			{
																				value : data.data[i].user_id,
																				text : data.data[i].name
													}));
												}
											} else {
												alertSS(data.data);
											}
											loading_done();
										},
										error : function(jqXhr, textStatus,
												errorThrown) {
											console.log(errorThrown);
                                   
											alertSS('Server Error');
											loading_done();
										}
									});
						
							
							$('#add_friend_to_list').click(function(){
								if(cap_to_show==''){
									$.mobile.changePage(
											"add_tag_friends.html",
											{
												changeHash : true
											});
								}
								
							});
							
							
							$('#tag_friends_list').change(
									function() {
										var foo = "";
										$('#tag_friends_list :selected').each(
												function(i, selected) {
													foo = $(selected).text()
															+ "," + foo;
												});
										console.log(foo);
										$('#people_tagged').empty();
										$('#people_tagged').append(foo);
									});
							if(tags.length>0){
								$('#people_tagged').empty();
								//for(var ip=0;ip<tags.length;ip++){
									$('#people_tagged').append("Add People - <b>"+tags.length+"</b>");
								//}
							}
							$('#finalsave').click(function() {
												var capText = $('#yourCaption')
														.val();
												console.log("TAGS>"+tags.length);
												loading();
												for(var ki=0;ki<tags.length;ki++){
													console.log("s>"+tags[ki]);		
													$.ajax({
															url : BASE_URL
																	+ 'api/app/tag_user',
																dataType : 'json',
															type : 'post',
															contentType : 'application/x-www-form-urlencoded',
															data : {
																user_id : user_id,
																post_id : img_temp_id,
																taged_user_id : tags[ki]
																},
															success : function(
																data,textStatus,jQxhr) {
																//console.log(JSON.stringify(data));

																					if (data.status == '1') {
																						console.log("tagged");
																					} else {
																						console.log(data.data);
																					}
																				},
																				error : function(
																						jqXhr,
																						textStatus,
																						errorThrown) {
																					console.log(errorThrown);
																					//alertSS('Server Error');
																				}
																			});
												}
																
												tags=[];

												var login = {
													file_id : img_temp_id,
													caption : capText,
													loc_log : current_lng,
													loc_lat : current_lat,
                                                    userid : user_id,
                                                  file_type_name:img_to_show_type
												};
                                                  
                                                 // alert(JSON.stringify(login))
                                                  
												$.ajax({
															url : BASE_URL
																	+ 'update.php',
															dataType : 'json',
															type : 'post',
															contentType : 'application/x-www-form-urlencoded',
															data : login,
															success : function(
																	data,
																	textStatus,
																	jQxhr) {
																console.log(JSON.stringify(data));

																if (data.update.length > 0) {
																	if (data.update[0] == 'sucess') {
																		alertSS('Image Updated Successfully');
																	} else {
																		alertSS('Video Updated Successfully');
																	}
																	loading_done();
																	if(new_img_vid==1){
																		$.mobile.changePage("dashboard.html",
																				{
																					changeHash : true
																		});
																	}else{
																		$.mobile.changePage("dashboard.html",
																				{
																					changeHash : true
																		});
																	}


																} else {
																	alertSS(data.data);
																}
															},
															error : function(
																	jqXhr,
																	textStatus,
																	errorThrown) {
																console
																		.log(errorThrown);
																alertSS('Server Error');
															}
														});

											});

							var init = true;
							function initialize(lat, lang) {
								init = false;
								var mapProp = {
									center : new google.maps.LatLng(lat, lang),
									zoom : 3,
									mapTypeId : google.maps.MapTypeId.HYBRID
								};
								var map = new google.maps.Map(document
										.getElementById("show_map"), mapProp);
								var marker = new google.maps.Marker(
										{
											position : new google.maps.LatLng(
													lat, lang),
											map : map,
											title : "Add",
											draggable : true,
										});
								google.maps.event.addListener(marker,
										'dragend', function(evt) {
											console.log(evt.latLng.lat()
													.toFixed(6)
													+ '<-->'
													+ evt.latLng.lng().toFixed(
															6));
											current_lat = evt.latLng.lat()
													.toFixed(6);
											current_lng = evt.latLng.lng()
													.toFixed(6);
										});

								google.maps.event.addListener(marker,
										'dragstart', function(evt) {
											console.log("dragging");
										});
							}

							$('#map_close').click(function() {
								$('#show_map').css('display', 'none');
								$('#map_close').css('display', 'none');
							});

							$('#add_location').click(function() {

												if (navigator.geolocation) {
													function success(pos) {
														// Location found, show map with these coordinates
														if (init) {
															current_lng = pos.coords.longitude;
															current_lat = pos.coords.latitude;
															initialize(
																	pos.coords.latitude,
																	pos.coords.longitude);
														}
														$('#show_map').css('display', '');
														$('#map_close').css('display', '');
														console.log("loc get"+ pos.coords.latitude);
													}
													function fail(error) {
														alertSS("Unable to get your GPS Location Please Turn on your GPS and try Again!!");
														console.log("default 2");
													}
													// Find the users current position.  Cache the location for 5 minutes, timeout after 6 seconds
													navigator.geolocation
															.getCurrentPosition(
																	success,
																	fail,
																	{
																		maximumAge : 500000,
																		enableHighAccuracy : true,
																		timeout : 6000
																	});
												} else {
													alertSS("Unable to get your GPS Location Please Turn on your GPS and try Again!!");
													console.log("default");
												}
											});

						});
	
	/*
	 * FAQ Page
	 */	
		
		$(document).on("pageshow","#faq",function(ev, dvt) {
			mytopmargin();
			document.removeEventListener("backbutton",back,false);
			$('#backC').click(
					function() {
						$.mobile.changePage(dvt.prevPage.attr('id')+ ".html", {changeHash : true});
			});
			
			$('#links').click(function(){
				window.open('http://www.malibuselfies.com/faq.html', '_blank', 'location=yes');
			});
			
			$('#tw_link').click(function(){
				window.open('http://www.twitter.com/TlrWorldWidellc', '_blank', 'location=yes');
			});
			
		});
		
		
		/*
		For Update user's Profile
		*/
		$(document).on("pageshow","#update_profile",function() {
							mytopmargin();
                       
                       //Ashutosh mishra11
                       var set_lang = localStorage.getItem('lang_select');
                       if(set_lang == "en_en"){
                       $("#update_profile_text").html(lan_code.english[0].updateprof);
                       $("#update_btn").html(lan_code.english[0].updatebtn);
                       }else{
                       $("#update_profile_text").html(lan_code.spanish[0].updateprof);
                       $("#update_btn").html(lan_code.spanish[0].updatebtn);
                       }

                       
							document.removeEventListener("backbutton",back,false);
							var final_date, final_month, final_year, final_gender;
							var user_pic = null;
							var d = new Date();
							var month = d.getMonth() + 1;
							var day = d.getDate();

							var output = d.getFullYear() + '/'
									+ (month < 10 ? '0' : '') + month + '/'
									+ (day < 10 ? '0' : '') + day;
							console.log(output);

							for (i = 1961; i < 2000; i++) {
								$('#year').append(
										'<option value="'+i+'">' + i
												+ '</option>');
							}

							function getMonth(i) {
								var months = [ 'jan', 'feb', 'mar', 'apr',
										'may', 'jun', 'jul', 'aug', 'sep',
										'oct', 'nov', 'dec' ];
								console.log(i + "--" + months[i - 1]);
								return months[i - 1];
							}
							function getMonthIndex(i) {
								var months = [ 'jan', 'feb', 'mar', 'apr',
										'may', 'jun', 'jul', 'aug', 'sep',
										'oct', 'nov', 'dec' ];
								console.log(i + "--" + months.indexOf(i));
								return months.indexOf(i);
							}

							$('#month').change(function() {
												var optionSelected = $(this)
														.find('option:selected');
												//var optTextSelected = optionSelected.text();
												var optValueSelected = optionSelected
														.val();
												console.log(optValueSelected);
												final_month = getMonthIndex(optValueSelected);
												final_month=final_month+1;
												console.log(final_month);
											});
							$('#date').change(function() {
										var optionSelected = $(this).find(
												'option:selected');
										//var optTextSelected = optionSelected.text();
										var optValueSelected = optionSelected
												.val();
										console.log(optValueSelected);
										final_date = optValueSelected;
									});
							$('#year').change(function() {
										var optionSelected = $(this).find(
												'option:selected');
										//var optTextSelected = optionSelected.text();
										var optValueSelected = optionSelected
												.val();
										console.log(optValueSelected);
										final_year = optValueSelected;
									});

							$('input[type=radio][name=radio-choice-h-2]').change(function() {
										if (this.value == 'male') {
											console.log("male");
											final_gender = "male";
										} else {
											final_gender = "female";
											console.log("female");
										}
									});
							function isNumeric(n) {
								  return /\d/.test(n);
								}
							$('#update_btn').click(function() {
                                                   alert(111)
										var password = $('#password').val();
										console.log(password);
										var username=$('#username').val();
										var city= $('#city').val();
										var nmp= $('#name').val();
                                                   if(nmp.charAt(0)=='0' || nmp.charAt(0)=='1' || nmp.charAt(0)=='2' || nmp.charAt(0)=='3' || nmp.charAt(0)=='4' || nmp.charAt(0)=='5' || nmp.charAt(0)=='6' || nmp.charAt(0)=='7' || nmp.charAt(0)=='8'|| nmp.charAt(0)=='9'|| nmp.charAt(0)==' ' ){
                                                   alertSS("Name should starts with a character");
                                                   return;
                                                   }
                                                   if((nmp == "") || (nmp == " ")){
                                                   alertSS("Name shouldn't be empty");
                                                   return;
                                                   }
										if(username.charAt(0)=='0' || username.charAt(0)=='1' || username.charAt(0)=='2' || username.charAt(0)=='3' || username.charAt(0)=='4' || username.charAt(0)=='5' || username.charAt(0)=='6' || username.charAt(0)=='7' || username.charAt(0)=='8'|| username.charAt(0)=='9' ){
											alertSS("Username should starts with a character");
										}
                                         else if(isNumeric(nmp)){
											alertSS("Name should contain characters and not Number");
										}else if(isNumeric(city)){
											alertSS("City should contain characters and not Number");
										}else if(city.length < 3){
											alertSS("City should contain at least 3 characters");
										}
										else{
										var update = {
											user_id : user_id,
											name : $('#username').val(),
											gender : final_gender,
											city : $('#city').val(),
											dob : final_year + "-"
													+ (final_month) + "-"
													+ final_date,
											about : $('#about').val(),
											name : $('#name').val()
										};
										console.log(JSON.stringify(update));
										if (user_pic == null) {
											console.log("No profile PIC");
											updateFile($('#name').val(),
													final_gender, $('#city')
															.val(), final_year
															+ "-" + final_month
															+ "-" + final_date,
															$('#about').val());
											} else {
												console.log("With PROFILE PIC");
												uploadFile(user_pic, $('#name')
														.val(), final_gender, $(
														'#city').val(), final_year
														+ "-" + final_month + "-"
														+ final_date, $('#about')
														.val());
											}
											if (password != null) {
												console.log("password");
											} else {
												console.log("no password");
											}
										}
									});

							$('#select_pic').click(function() {
								$('#popupMenu').css('display', '');
							});

							$('#popclose').click(function() {
								$('#popupMenu').css('display', 'none');
							});
							$('#popclose1').click(function() {
								$('#popupPassword').css('display', 'none');
							});

							$('#select_camera')
									.click(
											function() {
												var options = {
													quality : 100,
													destinationType : navigator.camera.DestinationType.FILE_URI,
													sourceType : navigator.camera.PictureSourceType.CAMERA,
													targetWidth : 400,
													targetHeight : 500,
													correctOrientation : true,
													allowEdit : true,
												};
												navigator.camera.getPicture(
														success, function(
																message) {
															alertSS("Error");
														}, options);
											});

							$("#select_gallery")
									.click(
											function() {
												var options = {
													quality : 100,
													destinationType : navigator.camera.DestinationType.FILE_URI,
													sourceType : navigator.camera.PictureSourceType.SAVEDPHOTOALBUM,
													allowEdit : true,
													targetWidth : 400,
													targetHeight : 500,
												};
												navigator.camera.getPicture(
														success, function(
																message) {
															alertSS("Error");
														}, options);
											});

							function success(imageData) {
								camera_use = true;
								user_pic = imageData;
								$('#user_img').attr("src", user_pic);
                       //ashutosh imageupload
                       
                       var fileURL = user_pic;
                       var fileURL = fileURL.split("?")[0];
                       console.log("dedede : : " + fileURL);
                       // loading();
                       var options = new FileUploadOptions();
                       options.fileKey = "file";
                       //options.fileName = fileURL.slice(0,fileURL.lastIndexOf('?'));
                       options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
                       
                       options.mimeType = "text/plain";
                       var params = new Object();
                       params.type = "image";
                       params.user_id = user_id;
                       //params.frame_name = frame_name;
                       options.params = params;
                       var up = new FileTransfer();
                       up.upload(fileURL, BASE_URL
                                 + "image.php", function(r) {
                                 
                                 videosrc = "";
                                 console.log("MM>>"
                                             + JSON.stringify(r.response));
                                 var msg = JSON.parse(r.response);
                                 console.log("ad>" + msg.status)
                                 if (msg.status == 'success') {
                                 img_temp_id = msg.filename
                                 
                                 loading_done();
                                 img_to_show_type='img';
                                 
                                 } else {
                                 alertSS("Server Error");
                                 }
                                 }, function(error) {
                                 alertSS("Error");
                                 
                                 }, options);
								$('#popupMenu').css('display', 'none');
							}

							$('#password').click(function() {
								$('#popupPassword').css('display', '');
							});

							$('#update_pass_btn').click(function() {
												var pass = $('#passw').val();
                                                         var old_pass = $('#old_passw').val();
												var confirmpass = $(
														'#confirmpassw').val();
												if(pass.length > 0 && pass.length < 6 ){
													alertSS("Password should be minimum 6 characters");
												}
												else if (pass.length > 0
														&& confirmpass.length > 0) {
													if (pass == confirmpass) {
														console.log("Pasws Server change");
														loading();
														$.ajax({
																	url : BASE_URL
																			+ 'update_pass.php',
																	dataType : 'json',
																	type : 'post',
																	contentType : 'application/x-www-form-urlencoded',
																	data : {
																		user_id : user_id,
																		password : pass,
                                                               old_pass:old_pass
																	},
																	success : function(
																			data,
																			textStatus,
																			jQxhr) {
																		//console.log(JSON.stringify(data));
																		if (data.profile[0] == 'sucess') {
																			alertSS("Password Updated Succesfully");
																			$('#passw').val('');
																			$('#confirmpassw').val('');
																		} else {
																			alertSS(data.profile[0]);
																		}
																		loading_done();
																	},
																	error : function(
																			jqXhr,
																			textStatus,
																			errorThrown) {
																		console
																				.log(errorThrown);
																		alertSS('Server Error');
																		loading_done();
																	}
																});
													} else {
														alertSS("Password and Confirm Password is not Matched");
													}
												} else {
													alertSS("Please Enter All Fields");
												}
											});

							function updateFile(name, gender, city, dob, about) {
								var login = {
									name : name,
									gender : gender,
									city : city,
									dob : dob,
									userid : user_id,
									about : about,
                                    action:'update'
								};
                       
                      // alert(JSON.stringify(login))
								loading();
								$.ajax({
											url : BASE_URL+'profile.php',
											dataType : 'json',
											type : 'post',
											contentType : 'application/x-www-form-urlencoded',
											data : login,
											success : function(data,
													textStatus, jQxhr) {
												//alert(JSON.stringify(data));
												if (data.profile.length > 0) {
													alertSS("Profile Updated Succesfully");
												} else {
													alertSS(data.data);
												}
												loading_done();
											},
											error : function(jqXhr, textStatus,
													errorThrown) {
												console.log(errorThrown);
												alertSS('Server Error1');
												loading_done();
											}
										});
							}

							function uploadFile(mediaFile, name, gender, city,
									dob, about) {
								loading();
								var ft = new FileTransfer();
								console.log("dfhsd>>" + mediaFile);
								path = mediaFile;
								var options = new FileUploadOptions();
								options.fileKey = "profile_pic";
								options.fileName = "filename.jpg";
								options.chunkedMode = true;
								var params = new Object();
								params.name = name;
								params.gender = gender;
								params.city = city;
								params.user_id = user_id;
								params.dob = dob;
								params.about = about;
								options.params = params;
								ft.upload(mediaFile,BASE_URL+ "api/app/update_profile",
												function(r) {
													console.log("MM>>"+ JSON.stringify(r.response));
													var msg = JSON.parse(r.response);
													console.log("ad>"+ msg.status)
													if (msg.status == '1') {
														console.log(msg.data);
														alertSS("Profile Updated Succesfully");
													}
													loading_done();
												}, function(error) {
													alertSS("Internet Error");
													loading_done();
												}, options, true);
							}

							var login = {
								userid : user_id
							};
							loading();
							$.ajax({
										url : BASE_URL+'profile.php',
										dataType : 'json',
										type : 'post',
										contentType : 'application/x-www-form-urlencoded',
										data : login,
										success : function(data, textStatus,
												jQxhr) {
											console.log(JSON.stringify(data));
											if (data.profile.length) {
												console.log(data.data);
												$('#username').val(data.profile[0].user_name);
												$('#email').val(data.profile[0].email);
												$('#about').val(data.profile[0].about);
												$('#city').val(data.profile[0].city);
												$('#name').val(data.profile[0].name);
												var dob = (data.profile[0].dob).split("-");
												var date = dob[2];
												var month = dob[1];
												var year = dob[0];
												final_date = date;
												final_month = month;
												final_year = year;
												console.log(date + '-' + month
														+ "-" + year);
												$("#date").find('option[value="' + date+ '"]').prop("selected", true);
												$("#month").find('option[value="'+ getMonth(month)+ '"]').prop("selected", true);
												$("#year").find('option[value="' + year+ '"]').prop("selected", true);
												$("#date").trigger("change");
												$("#month").trigger("change");
												$("#year").trigger("change");
												var gender = data.profile[0].gender;
												console.log(gender);
												final_gender = gender;

												if (gender == 'male') {
													$('input[type=radio][name=radio-choice-h-2][value="female"]').prop('false', true).checkboxradio("refresh");
													$('input[type=radio][name=radio-choice-h-2][value="male"]').prop('checked',true).checkboxradio("refresh");
													console.log("male");
												} else {
													$('input[type=radio][name=radio-choice-h-2][value="female"]').prop('checked',true).checkboxradio("refresh");
													$('input[type=radio][name=radio-choice-h-2][value="male"]').prop('checked',false).checkboxradio("refresh");
													console.log("female");
												}
												if (data.profile[0].profile_pic != "") {
													$('#user_img').attr("src",BASE_URL+'/'+data.profile[0].profile_pic);
												}
											} else {
												alertSS(data.profile[0]);
											}
											loading_done();
										},
										error : function(jqXhr, textStatus,
												errorThrown) {
											console.log(errorThrown);
											alertSS('Server Error');
											loading_done();
										}
									});

						});
	});
	
//Push Notification
	//FOr Messaging
	var get_message='0';
	var get_like_cmt="0";
	function initPushwoosh()
	{
		loading();
	   var pushNotification = window.plugins.pushNotification;
	   pushNotification.setMultiNotificationMode();
	   pushNotification.clearNotificationCenter();
	   //set push notifications handler
	   if(device.platform === 'iOS'){
		   
		   document.addEventListener('push-notification', function(event) {
		        //alert("MSG_RECEIVED");           
	    	 //  alert('user data: ' + JSON.stringify(event.notification));
		        var title = event.notification.aps;
		       var userData = event.notification.u;
		       //	alert(JSON.stringify(userData));
		       //	alert(userData.msg_id);
		        var ud;
		        if(device.platform === 'iOS'){
		        	ud = userData;
		        }else{
		        	ud = JSON.parse(userData);
		        }
		        //  if(typeof(userData) != "undefined") {
		           //alert('user data: ' + JSON.stringify(userData));
		           //alert('user data: ' + ud.username);
		           if(!event.notification.onStart){
			        // alert("OnstartFAlse");
		        	  
			          //alert(user_id+"--"+conversation_id+"--"+to_view_profile);
			          if(user_id!=''){
			        	if(conversation_id!='' &&  to_view_profile!=''){
			        		//console.log("CHAT>"+event.notification.userdata.userpic+"--"+event.notification.userdata.username+"--"+event.notification.userdata.id);
			        		//alert("chat Screen");
			        		var jpic= BASE_URL+ud.userpic;
			        		if(ud.userpic==''){
			        			jpic='img/suer_profile.png';
			        		}
			        		var dt=dateFromString(ud.time+' UTC');
							var time = dt.getHours() + ":" + dt.getMinutes();
							//console.log(ud.time+"<><><>"+dt.toString());
			        		if(to_view_profile==ud.id){
								//$('#chat_list').append('<li id="'+ud.msg_id+'" data-value="'+ud.msg_id+'" style="background: transparent; background-color: transparent; width: 100%;margin-top:8px;">	<div class="ui-grid-b" style="background: transparent;padding-left:5px;margin-left:6%;"><div class="ui-block-a"	style="background: white; padding: 6px 12px; border-radius: 8px; width: 70%;">	<label	style="text-transform: none; text-shadow: none; text-align: left; font-weight: bold; font-size: medium; width: 90%;">'+ud.username+'</label><p	style="text-transform: none; text-shadow: none; text-align: left; font-weight: lighter; font-size: x-small; width: 90%; white-space: pre-line; word-wrap: break-word;">'+ud.message+'</p>	<label	style="text-transform: none; text-shadow: none; text-align: left; color: #93cbe2; font-size: x-small;">'+time+'</label></div><img class="ui-block-b"	src="img/right_icon_ic.png" style="height: 25px; width: 25px; margin-top: 10px; background-repeat: no-repeat; background-size: cover;"><div class="ui-block-c" style="width: 15%; background: transparent; float: right; margin-right: 9px;">	<img style="width: 40px; height: 40px;" src="'+jpic+'"></div></div></li>');        			
								$('#chat_list').append('<li	id="'+ud.msg_id+'" data-value="'+ud.msg_id+'" style="background: transparent; background-color: transparent; width: 100%;margin-top:10px;">	<div class="ui-grid-b" style="background: transparent;padding-left:5px;margin-left:6%;"><div class="ui-block-a"	style="width: 15%; background: transparent; float: left;">	<img style="width: 40px; height: 40px;" src="'+jpic+'"></div>	<img class="ui-block-b" src="img/left_icon_ic.png"	style="height: 27px; width: 27px; margin-top: 10px; background-repeat: no-repeat; background-size: cover;"><div class="ui-block-c" style="background: white; padding: 6px 12px; border-radius: 8px; width: 70%;">	<label	style="text-transform: none; text-shadow: none; text-align: left; font-weight: bold; font-size: medium; width: 90%;">'+ud.username+'</label><p	style="text-transform: none; text-shadow: none; text-align: left; font-weight: lighter; font-size: x-small; width: 90%; white-space: pre-line; word-wrap: break-word;">'+ud.message+'</p>	<label	style="text-transform: none; text-shadow: none; text-align: left; color: #93cbe2; font-size: x-small;">'+time+'</label>	</div>	</div></li>');
								location.hash = ud.msg_id;
			        		}
			        	}else if(show_all_msg=='1'){
			        		//alert("msgScreen");
			        		 if(device.platform === 'iOS'){
					        	   window.plugins.toast.showLongBottom(title.alert, function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});		        	  
					          }
			        		loading();
			    			$.ajax({
			    						url : BASE_URL + 'api/app/get_all_conversations',
			    						dataType : 'json',
			    						type : 'post',
			    						contentType : 'application/x-www-form-urlencoded',
			    						data : {
			    							user_id : user_id
			    						},
			    						success : function(data, textStatus,jQxhr) {
			    							console.log(JSON.stringify(data));
			    							if (data.status == '1') {
			    								if(data.data.length>0){
			    									$('#msg_list').empty();
			    									for(var i=0;i<data.data.length;i++){
			    										var jpic=BASE_URL+data.data[i].profile_pic;
			    										if(data.data[i].profile_pic==''){
			    											jpic='img/suer_profile.png';
			    										}
			    										$('#msg_list').append('<li data-value="'+data.data[i].conversation_id+'" style="padding: 5px;margin-left: 6.7%;"><div class="ui-grid-a">	<img class="ui-block-a" src="'+jpic+'"	style="height: 45px; width: 45px;">	<div class="ui-block-b" style="margin: 3px 10px;">	<label	style="text-transform: none; text-align: left; text-shadow: none; font-weight: bold; font-size: small; color: black;">'+data.data[i].user_name+'</label>	<p	style="text-transform: none; text-align: left; text-shadow: none; font-size: x-small; font-weight: lighter; color: #a9a9a9;">'+data.data[i].last_message+'</p>	</div>	</div><div style="height:1px;width:100%;background:#a9a9a9;float:left;"></div>	</li>');
			    									}
			    									$('#msg_list li').click(function(){
			    										var id=$(this).attr('data-value');
			    										console.log(id);
			    										conversation_id=id;
			    										$.mobile.changePage("chatScreen.html",{changeHash : true});
			    									});
			    									loading_done();
			    								}else{
			    									alertSS("No Messages");
			    									loading_done();
			    								}

			    							}else{
			    								alertSS(data.data);
			    								loading_done();
			    							}
			    						},
			    						error : function(jqXhr, textStatus,
			    								errorThrown) {
			    							console.log(errorThrown);
			    							alertSS('Server Error');
			    							loading_done();
			    						}
			    			});	
			        		
			        		
			        	}else{
			        		//alert("NONE");
			        		 if(device.platform === 'iOS'){
					        	   window.plugins.toast.showLongBottom(title.alert, function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});		        	  
					          }
			        	}
			          }
			           
		           }else{
		        	 // alert("Not ForegroiundOnstart True");
		        	   console.log("Not Foregroiund>"+ud.page);
		        	   if(ud.page=='comment' || ud.page=='like'){
		        		  console.log("adsad");
		        		  get_like_cmt="1";
		        		  if(user_id!=''){
			        		   $.mobile.changePage("notification.html", {
									changeHash : true
								});
			        	   } 
		        	   }else{
		        		   get_message='1';
			        	   if(user_id!=''){
			        		   $.mobile.changePage("messageMain.html", {
									changeHash : true
								});
			        	   } 
		        	   }
		        	 
		           }
		     //  }
		   });
		   
		   
	   }else{
	   
	   document.addEventListener('push-notification', function(event) {
	        //alert("MSG_RECEIVED");           
//    	   alert('user data: ' + JSON.stringify(event.notification));
	        var title = event.notification.title;
	       var userData = event.notification.u;
	       //	alert(JSON.stringify(userData));
	       //	alert(userData.msg_id);
	        var ud;
	        if(device.platform === 'iOS'){
	        	ud = userData;
	        }else{
	        	ud = JSON.parse(userData);
	        }
	        //  if(typeof(userData) != "undefined") {
	           //alert('user data: ' + JSON.stringify(userData));
	           //alert('user data: ' + ud.username);
	           if(event.notification.foreground){
		          if(device.platform === 'iOS'){
		        	   window.plugins.toast.showLongBottom(title, function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});		        	  
		          }
		          
		          if(user_id!=''){
		        	if(conversation_id!='' &&  to_view_profile!=''){
		        		//console.log("CHAT>"+event.notification.userdata.userpic+"--"+event.notification.userdata.username+"--"+event.notification.userdata.id);
		        		var jpic= BASE_URL+ud.userpic;
		        		if(ud.userpic==''){
		        			jpic='img/suer_profile.png';
		        		}
		        		var dt=dateFromString(ud.time+' UTC');
						var time = dt.getHours() + ":" + dt.getMinutes();
						//console.log(ud.time+"<><><>"+dt.toString());
		        		if(to_view_profile==ud.id){
							//$('#chat_list').append('<li id="'+ud.msg_id+'" data-value="'+ud.msg_id+'" style="background: transparent; background-color: transparent; width: 100%;margin-top:8px;">	<div class="ui-grid-b" style="background: transparent;padding-left:5px;margin-left:6%;"><div class="ui-block-a"	style="background: white; padding: 6px 12px; border-radius: 8px; width: 70%;">	<label	style="text-transform: none; text-shadow: none; text-align: left; font-weight: bold; font-size: medium; width: 90%;">'+ud.username+'</label><p	style="text-transform: none; text-shadow: none; text-align: left; font-weight: lighter; font-size: x-small; width: 90%; white-space: pre-line; word-wrap: break-word;">'+ud.message+'</p>	<label	style="text-transform: none; text-shadow: none; text-align: left; color: #93cbe2; font-size: x-small;">'+time+'</label></div><img class="ui-block-b"	src="img/right_icon_ic.png" style="height: 25px; width: 25px; margin-top: 10px; background-repeat: no-repeat; background-size: cover;"><div class="ui-block-c" style="width: 15%; background: transparent; float: right; margin-right: 9px;">	<img style="width: 40px; height: 40px;" src="'+jpic+'"></div></div></li>');        			
							$('#chat_list').append('<li	id="'+ud.msg_id+'" data-value="'+ud.msg_id+'" style="background: transparent; background-color: transparent; width: 100%;margin-top:10px;">	<div class="ui-grid-b" style="background: transparent;padding-left:5px;margin-left:6%;"><div class="ui-block-a"	style="width: 15%; background: transparent; float: left;">	<img style="width: 40px; height: 40px;" src="'+jpic+'"></div>	<img class="ui-block-b" src="img/left_icon_ic.png"	style="height: 27px; width: 27px; margin-top: 10px; background-repeat: no-repeat; background-size: cover;"><div class="ui-block-c" style="background: white; padding: 6px 12px; border-radius: 8px; width: 70%;">	<label	style="text-transform: none; text-shadow: none; text-align: left; font-weight: bold; font-size: medium; width: 90%;">'+ud.username+'</label><p	style="text-transform: none; text-shadow: none; text-align: left; font-weight: lighter; font-size: small; width: 90%; white-space: pre-line; word-wrap: break-word;">'+ud.message+'</p>	<label	style="text-transform: none; text-shadow: none; text-align: left; color: #93cbe2; font-size: small;">'+time+'</label>	</div>	</div></li>');
							location.hash = ud.msg_id;
		        		}
		        	}else if(show_all_msg=='1'){
		        		
		        		loading();
		    			$.ajax({
		    						url : BASE_URL + 'api/app/get_all_conversations',
		    						dataType : 'json',
		    						type : 'post',
		    						contentType : 'application/x-www-form-urlencoded',
		    						data : {
		    							user_id : user_id
		    						},
		    						success : function(data, textStatus,jQxhr) {
		    							console.log(JSON.stringify(data));
		    							if (data.status == '1') {
		    								if(data.data.length>0){
		    									$('#msg_list').empty();
		    									for(var i=0;i<data.data.length;i++){
		    										var jpic=BASE_URL+data.data[i].profile_pic;
		    										if(data.data[i].profile_pic==''){
		    											jpic='img/suer_profile.png';
		    										}
		    										$('#msg_list').append('<li data-value="'+data.data[i].conversation_id+'" style="padding: 5px;margin-left: 6.7%;"><div class="ui-grid-a">	<img class="ui-block-a" src="'+jpic+'"	style="height: 45px; width: 45px;">	<div class="ui-block-b" style="margin: 3px 10px;">	<label	style="text-transform: none; text-align: left; text-shadow: none; font-weight: bold; font-size: medium; color: black;">'+data.data[i].user_name+'</label>	<p	style="text-transform: none; text-align: left; text-shadow: none; font-size: small; font-weight: lighter; color: #a9a9a9;">'+data.data[i].last_message+'</p>	</div>	</div><div style="height:1px;width:100%;background:#a9a9a9;float:left;"></div>	</li>');
		    									}
		    									$('#msg_list li').click(function(){
		    										var id=$(this).attr('data-value');
		    										console.log(id);
		    										conversation_id=id;
		    										$.mobile.changePage("chatScreen.html",{changeHash : true});
		    									});
		    									loading_done();
		    								}else{
		    									alertSS("No Messages");
		    									loading_done();
		    								}

		    							}else{
		    								alertSS(data.data);
		    								loading_done();
		    							}
		    						},
		    						error : function(jqXhr, textStatus,
		    								errorThrown) {
		    							console.log(errorThrown);
		    							alertSS('Server Error');
		    							loading_done();
		    						}
		    			});	
		        		
		        		
		        	}else{
		        		console.log("NONE");
		        	}
		          }
		           
	           }else{
	        	   console.log("Not Foregroiund>"+ud.page);
	        	   if(ud.page=='comment' || ud.page=='like'){
	        		  console.log("adsad");
	        		  get_like_cmt="1";
	        		  if(user_id!=''){
		        		   $.mobile.changePage("notification.html", {
								changeHash : true
							});
		        	   } 
	        	   }else{
	        		   get_message='1';
	        		   console.log("$##&v324");
		        	   if(user_id!=''){
		        		   $.mobile.changePage("messageMain.html", {
								changeHash : true
							});
		        	   }
	        	   }
	        	  
	           }
	     //  }
	   });
	} 
	   pushNotification.setSoundType(2);

	   //initialize Pushwoosh with projectid: "GOOGLE_PROJECT_ID", appid : "PUSHWOOSH_APP_ID". This will trigger all pending push notifications on start.
	  if(device.platform === 'iOS'){
		   pushNotification.onDeviceReady({ pw_appid : "A7E47-3137F" });
	  }else{
		   pushNotification.onDeviceReady({ projectid: "310446867981", appid : "A7E47-3137F" });		  
	  }

	 if(device.platform === 'iOS'){
		
		 pushNotification.getRemoteNotificationStatus(function(status){
			 var isenabled = status.enabled;
			// alert("EN>"+isenabled);
			 if(isenabled=="1"){
				 //register for pushes
				 //alert('Allowed');
				   pushNotification.registerDevice(function(status) {
				        //pushtoken  = status;
				          // alert('push token: ' + status['deviceToken']);
				           push_id = status['deviceToken'];
				           pushNotification.getPushwooshHWID(function(deviceid){
				        	   //alert("DEVICEID>"+deviceid);
				        	   
				        		if(deviceid==''){
				        			push_id="NoPushID";
				        			deviceid='NoDeviceid';
				        		}
				        			//alert(deviceid+"----"+push_id);
			        			$.ajax({
			        				url : BASE_URL + 'api/app/device_login_temp',
			        				dataType : 'json',
			        				type : 'post',
			        				contentType : 'application/x-www-form-urlencoded',
			        				data : {
			        					device_id : device.uuid,
			        					push_id: push_id
			        				},
			        				success : function(data, textStatus, jQxhr) {
			        					//console.log(JSON.stringify(data));
			        					loading_done();
			        					if (data.status == '1') {
			        						user_id = data.data.id;
			        						if(get_message=='1'){
			        							$.mobile.changePage("messageMain.html", {
				        							changeHash : true
				        						});
			        						}else if( get_like_cmt=="1"){
			        							$.mobile.changePage("notification.html", {
				        							changeHash : true
				        						});
			        						}else{
			        							$.mobile.changePage("profile.html", {
				        							changeHash : true
				        						});
			        						}
			        					} else {
			        						//alert(data.data);
			        					}
			        				},
			        				error : function(jqXhr, textStatus, errorThrown) {
			        					console.log(errorThrown);
			        					loading_done();
			        					alertSS('Server Error');
			        				}
			        			});
				          });
				   	},
				   	function(status) {
			    	   alert(JSON.stringify(['failed to register ', status]));
			    	   loading_done();
			       	});	
			 }else{
				// alert('No Aloowed');
				 pushNotification.registerDevice(function(status) {
				        //pushtoken  = status;
				         //  alert('push token: ' + status['deviceToken']);
				           push_id = status['deviceToken'];
				           pushNotification.getPushwooshHWID(function(deviceid){
				        	  //alert("DEVICEID>"+deviceid);
				        	   
				        		if(push_id=='' || deviceid==''){
				        			push_id="NoPushID";
				        			deviceid='NoDeviceid';
				        		}
				        	
			        			$.ajax({
			        				url : BASE_URL + 'api/app/device_login_temp',
			        				dataType : 'json',
			        				type : 'post',
			        				contentType : 'application/x-www-form-urlencoded',
			        				data : {
			        					device_id : device.uuid,
			        					push_id: push_id
			        				},
			        				success : function(data, textStatus, jQxhr) {
			        					//console.log(JSON.stringify(data));
			        					loading_done();
			        					if (data.status == '1') {
			        						user_id = data.data.id;
			        						if(get_message=='1'){
			        							$.mobile.changePage("messageMain.html", {
				        							changeHash : true
				        						});
			        						}else if( get_like_cmt=="1"){
			        							$.mobile.changePage("notification.html", {
				        							changeHash : true
				        						});
			        						}else{
			        							$.mobile.changePage("profile.html", {
				        							changeHash : true
				        						});
			        						}
			        						
			        					} else {
			        						//alert(data.data);
			        					}
			        				},
			        				error : function(jqXhr, textStatus, errorThrown) {
			        					console.log(errorThrown);
			        					loading_done();
			        					alertSS('Server Error');
			        				}
			        			});
				          });
				   	},
				   	function(status) {
			    	   alert(JSON.stringify(['failed to register ', status]));
			    		push_id="NoPushID";
	        			deviceid='NoDeviceid';
			    	   $.ajax({
	        				url : BASE_URL + 'api/app/device_login_temp',
	        				dataType : 'json',
	        				type : 'post',
	        				contentType : 'application/x-www-form-urlencoded',
	        				data : {
	        					device_id : device.uuid,
	        					push_id: push_id
	        				},
	        				success : function(data, textStatus, jQxhr) {
	        					//console.log(JSON.stringify(data));
	        					loading_done();
	        					if (data.status == '1') {
	        						user_id = data.data.id;
	        						if(get_message=='1'){
	        							$.mobile.changePage("messageMain.html", {
		        							changeHash : true
		        						});
	        						}else if( get_like_cmt=="1"){
	        							$.mobile.changePage("notification.html", {
		        							changeHash : true
		        						});
	        						}else{
	        							$.mobile.changePage("profile.html", {
		        							changeHash : true
		        						});
	        						}
	        						
	        					} else {
	        						//alert(data.data);
	        					}
	        				},
	        				error : function(jqXhr, textStatus, errorThrown) {
	        					console.log(errorThrown);
	        					loading_done();
	        					alertSS('Server Error');
	        				}
	        			});
			       	});
				 /*
				 $.ajax({
     				url : BASE_URL + 'api/app/device_login_temp',
     				dataType : 'json',
     				type : 'post',
     				contentType : 'application/x-www-form-urlencoded',
     				data : {
     					device_id : device.uuid,
     					push_id: 'NoPushId'
     				},
     				success : function(data, textStatus, jQxhr) {
     					//console.log(JSON.stringify(data));
     					loading_done();
     					if (data.status == '1') {
     						user_id = data.data.id;
     						if(get_message=='1'){
     							$.mobile.changePage("messageMain.html", {
	        							changeHash : true
	        						});
     						}else{
     							$.mobile.changePage("profile.html", {
	        							changeHash : true
	        						});
     						}
     						
     					} else {
     						alert(data.data);
     					}
     				},
     				error : function(jqXhr, textStatus, errorThrown) {
     					console.log(errorThrown);
     					loading_done();
     					alertSS('Server Error');
     				}
     			});
     			*/
			 }
		 });	 
	 }else{
		 //register for pushes
		   pushNotification.registerDevice(function(status) {
		        //pushtoken  = status;
		           console.warn('push token: ' + status);
		           push_id = status;
		           pushNotification.getPushwooshHWID(function(deviceid){
		        	   console.log("DEVICEID>"+deviceid);
		        	   
		        		if(status=='' || deviceid==''){
		        			status="NoPushID";
		        			deviceid='NoDeviceid';
		        		}
		        	
	        			$.ajax({
	        				url : BASE_URL + 'api/app/device_login_temp',
	        				dataType : 'json',
	        				type : 'post',
	        				contentType : 'application/x-www-form-urlencoded',
	        				data : {
	        					device_id : device.uuid,
	        					push_id: status
	        				},
	        				success : function(data, textStatus, jQxhr) {
	        					//console.log(JSON.stringify(data));
	        					loading_done();
	        					if (data.status == '1') {
	        						user_id = data.data.id;
	        						if(get_message=='1'){
	        							$.mobile.changePage("messageMain.html", {
		        							changeHash : true
		        						});
	        						}else if( get_like_cmt=="1"){
	        							$.mobile.changePage("notification.html", {
		        							changeHash : true
		        						});
	        						}else{
	        							$.mobile.changePage("profile.html", {
		        							changeHash : true
		        						});
	        						}
	        					} else {
	        						//alert(data.data);
	        					}
	        				},
	        				error : function(jqXhr, textStatus, errorThrown) {
	        					console.log(errorThrown);
	        					loading_done();
	        					alertSS('Server Error');
	        				}
	        			});
		          });
		   	},
		   	function(status) {
	    	   //alertSS(JSON.stringify(['failed to register ', status]));
		   		alertSS('Server Error Failed to Register!!');
		   		loading_done();
	       	});	
	 }

}
                                                            
                                                            
                                                            
                                                            
    function slide_page(dir,page,noslide) {

                                                            

    var slide = ""
    if(dir == 'front'){
    slide = 'left'
    }else if(dir == 'flip'){
    slide = 'up'
    }else{
    slide = 'right'
    }
    //window.location.href = '#'+page;
    // return;
    //alert('#'+page)
    // not passing in options makes the plugin fall back to the defaults defined in the JS API

    //var sli_page = '#'+page
    if(noslide == 'true'){
    sli_page = page;
    }
    var theOptions = {
    "href" : page,
    "direction"        : slide, // 'left|right|up|down', default 'left' (which is like 'next')
    "duration"         :  500, // in milliseconds (ms), default 400
    "slowdownfactor"   :    3, // overlap views (higher number is more) or no overlap (1), default 4
    "iosdelay"         :  200, // ms to wait for the iOS webview to update before animation kicks in, default 60
    "androiddelay"     :  150, // same as above but for Android, default 70
    "winphonedelay"    :  250, // same as above but for Windows Phone, default 200,
    "fixedPixelsTop"   :    0, // the number of pixels of your fixed header, default 0 (iOS and Android)
    "fixedPixelsBottom":   0  // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
    };
    window.plugins.nativepagetransitions.slide(
                                       theOptions,
                                       function () {
                                       //alert(14)
                                       },
                                       function (msg) {
                                       alert('error: ' + msg);
                                       });
    }

                                                            function doLogin(){
                                                            var username = $('#username')
                                                            .val();
                                                            var password = $('#password')
                                                            .val();
                                                            //alert(124)
                                                            console.log("ICICD>"
                                                                        + device.uuid);
                                                            if (username == ''
                                                                || password == '') {
                                                            alertSS("Please enter all fields");
                                                            } else {
                                                            var login = {
                                                            user_name : username,
                                                            password : password,
                                                            device_id : device.uuid,
                                                            push_id : push_id
                                                            };
                                                            loading();
                                                            $.ajax({
                                                                   url : BASE_URL+'login.php?email='+username+'&password='+password+'',
                                                                   dataType : 'json',
                                                                   type : 'post',
                                                                   contentType : 'application/x-www-form-urlencoded',
                                                                   data : login,
                                                                   success : function(
                                                                                      data,
                                                                                      textStatus,
                                                                                      jQxhr) {
                                                                   
                                                                   if (data.status == 'success') {
                                                                      // alert('Login Successfully');
                                                                   $('#username').val('');
                                                                   $('#password').val('');
                                                                   user_id = data.users[0].id;
                                                                   localStorage.setItem("userid", user_id);
                                                                   $.mobile.changePage("dashboard.html",{changeHash : true});
                                                                   
                                                                   } else {
                                                                   alertSS("Incorrect Username or Password.");
                                                                   }
                                                                   loading_done();
                                                                   },
                                                                   error : function(
                                                                                    jqXhr,
                                                                                    textStatus,
                                                                                    errorThrown) {
                                                                   console
                                                                   .log(errorThrown);
                                                                   alertSS('Server Error');
                                                                   loading_done();
                                                                   }
                                                                   });
                                                            }
                                                            }
                                                            
                                                            
                                                            

                                                            
                                                            
function doRegistration11(){
var type = '1';
//alert(fb_tw_id+"---"+type);
var username = $('#username').val();
var email = $('#email').val();
var password = $('#password').val();
function ValidateEmail(email) {
var expr = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
        return expr.test(email);
        };
        if (username == ''    || email == '') {
        alertSS("Please enter all fields");
        } else if (!ValidateEmail(email)) {
        alertSS("Enter valid Email");
        }else if(username.charAt(0)=='0' || username.charAt(0)=='1' || username.charAt(0)=='2' || username.charAt(0)=='3' || username.charAt(0)=='4' || username.charAt(0)=='5' || username.charAt(0)=='6' || username.charAt(0)=='7' || username.charAt(0)=='8'|| username.charAt(0)=='9' ){
        alertSS("Username should starts with a character");
                            }
        else if(!username.match(/^[0-9a-zA-Z]+$/)){
        alertSS("Username shouldn't contain special characters ");
        }
        else if((type == '1')){
        if(password.length < 6){
        alertSS("Password should be 6 character or more");
        }else{
        if (type == '2'    || type == '3') {
        reg_user(username,
                 password,
                 email, type,
                 fb_tw_id,
                 profile_pic,
                 device.uuid);
        } else {
        console.log("dahrid");
        if (password == '') {
        alertSS("Please enter all fields");
        } else {
        console.log("INI");
                            var fb_tw_id = 'dferfrfrf';
                            var profile_pic = 'dededed';
        reg_user(
                 username,
                 password,
                 email,
                 type,
                 fb_tw_id,
                 profile_pic,
                 '');
        }
        }
        }
        }else if(username.length < 2){
        alertSS("Username should be 2 or more than 2 characters");
        }else {
        console.log("sadasd3223");
        if (type == '2'    || type == '3') {
        reg_user(username,
                 password,
                 email, type,
                 fb_tw_id,
                 profile_pic,
                 device.uuid);
        } else {
        console.log("dahrid");
        if (password == '') {
        alertSS("Please enter all fields");
        } else {
        console.log("INI");
        reg_user(
                 username,
                 password,
                 email,
                 type,
                 fb_tw_id,
                 profile_pic,
                 '');
        }
        }
        
        }

                                                            
                                                            }
                            function reg_user(username, password, email, type,
                                              fb_tw_id, profile_pic, deviceid) {
                            var person;
                            
                            if ((type == '2' || type == '3') && password=='') {
                            console.log("sadsadsadas");
                            person = {
                            user_name : username,
                            password : password,
                            name : username,
                            email : email,
                            type : type,
                            profile_pic : profile_pic,
                            device_id : deviceid,
                            push_id : push_id
                            };
                            }else{
                            console.log("sdasa");
                            person = {
                            user_name : username,
                            password : password,
                            name : username,
                            email : email,
                            type : type,
                            profile_pic : profile_pic,
                            device_id : deviceid,
                            push_id : ''
                            };
                            }
                            console.log(JSON.stringify(person));
                            loading();
                           // alert(JSON.stringify(person))
                            $.ajax({
                                   url : BASE_URL + 'register.php',
                                   dataType : 'json',
                                   type : 'post',
                                   contentType : 'application/x-www-form-urlencoded',
                                   data : person,
                                   success : function(data,
                                                      textStatus, jQxhr) {
                                   console.log(JSON.stringify(data));
                                   if (data.register[0] == 'sucess') {
                                   alertSS('User Registered Successfully \n Please Login');
                                   $('#username').val('');
                                   $('#email').val('');
                                   $('#password').val('');
                                   if ((type == '2' || type == '3') && password=='') {
                                   user_id = data.id;
                                   $.mobile.changePage("profile.html",{changeHash : true});
                                   } else {
                                   $.mobile.changePage("register_login.html",{changeHash : true});
                                   }
                                   
                                   } else {
                                   alertSS(data.data);
                                   }
                                   loading_done();
                                   },
                                   error : function(jqXhr, textStatus,
                                                    errorThrown) {
                                   console.log(errorThrown);
                                   alertSS('Server Error');
                                   loading_done();
                                   }
                                   });
                            
                            }
                            
                            
                            
                            
                            function doFollowing(id){
                            var login = {
                            userid : user_id,
                            fid:id
                            
                            };

                            
                            $.ajax({
                                   url : BASE_URL + 'following.php',
                                   dataType : 'json',
                                   type : 'post',
                                   contentType : 'application/x-www-form-urlencoded',
                                   data : login,
                                   success : function(data,
                                                      textStatus, jQxhr) {
                                   console.log(JSON.stringify(data));
                                   if (data.follower[0] == 'sucess') {
                                   //alertSS('Follow sucessfully');
                                   
                                   $('#tb_following').click();
                                   
                                   } else {
                                   alertSS(data.data);
                                   }
                                   loading_done();
                                   },
                                   error : function(jqXhr, textStatus,
                                                    errorThrown) {
                                   console.log(errorThrown);
                                   alertSS('Server Error');
                                   loading_done();
                                   }
                                   });
                            }

    function fbshareImg(){
        var shareimg = $('#postimg').attr('src');
        var share_text = $('#caption').text();
        window.plugins.socialsharing.share(share_text, null, shareimg, null)
    }


                            function changeLanguage(){
                           // alert(33)
                           // alert(lan_code.english[0].login);
                            $('#login_btn').html(lan_code.spanish[0].login)
                            $('#forgetPass').html(lan_code.spanish[0].Forgot_username)
                            }
