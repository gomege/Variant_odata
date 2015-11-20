var Glob_P="BA";
var Glob_T="";
var Glob_F="";
var Glob_K="";
var Glob_B="";
var gl_imgpath;
var oImage;

sap.ui.core.mvc.Controller.extend("Variantconf.view.Detail", {

	onInit: function() {
		this.oInitialLoadFinishedDeferred = jQuery.Deferred();

		if (sap.ui.Device.system.phone) {
			//Do not wait for the master when in mobile phone resolution
			this.oInitialLoadFinishedDeferred.resolve();
		} else {
			this.getView().setBusy(true);
			var oEventBus = this.getEventBus();
			oEventBus.subscribe("Component", "MetadataFailed", this.onMetadataFailed, this);
			oEventBus.subscribe("Master", "InitialLoadFinished", this.onMasterLoaded, this);
		}

		this.getRouter().attachRouteMatched(this.onRouteMatched, this);
	},
	
	onMasterLoaded: function(sChannel, sEvent) {
		this.getView().setBusy(false);
		this.oInitialLoadFinishedDeferred.resolve();
	},

	onMetadataFailed: function() {
		this.getView().setBusy(false);
		this.oInitialLoadFinishedDeferred.resolve();
		this.showEmptyView();
	},

	onRouteMatched: function(oEvent) {
		var oParameters = oEvent.getParameters();

		jQuery.when(this.oInitialLoadFinishedDeferred).then(jQuery.proxy(function() {
			var oView = this.getView();

			// When navigating in the Detail page, update the binding context 
			if (oParameters.name !== "detail") {
				return;
			}

			var sEntityPath = "/" + oParameters.arguments.entity;
			this.bindView(sEntityPath);

			var oIconTabBar = oView.byId("idIconTabBar");
			oIconTabBar.getItems().forEach(function(oItem) {
				if (oItem.getKey() !== "selfInfo") {
					oItem.bindElement(oItem.getKey());
				}
			});
			// Specify the tab being focused
//			var sTabKey = oParameters.arguments.tab;
//			this.getEventBus().publish("Detail", "TabChanged", {
//				sTabKey: sTabKey
//			});

			if (oIconTabBar.getSelectedKey() !== "selfInfo") {
				oIconTabBar.setSelectedKey("selfInfo");
			}
				var oTyp = this.byId("Typ");
				oTyp.setSelectedKey("");
				var oFarbe = this.byId("Farbe");
				oFarbe.setSelectedKey("");
				var oStoff = this.byId("Stoff");
				oStoff.setSelectedKey(" ");
				var oKissen = this.byId("Kissen");
				oKissen.setSelectedKey("");
				Glob_T=""; Glob_F=""; Glob_B=""; Glob_K="";
				var Krit = this._Path();
				oImage = this.byId("odata_img00"); // image of the first tab is placed
                oImage.setSrc(gl_imgpath);
		}, this));
	},

	bindView: function(sEntityPath) {
		var oView = this.getView();
		oView.bindElement(sEntityPath);

		//Check if the data is already on the client
		if (!oView.getModel().getData(sEntityPath)) {

			// Check that the entity specified was found.
			oView.getElementBinding().attachEventOnce("dataReceived", jQuery.proxy(function() {
				var oData = oView.getModel().getData(sEntityPath);
				if (!oData) {
					this.showEmptyView();
					this.fireDetailNotFound();
				} else {
					this.fireDetailChanged(sEntityPath);
				}
			}, this));

		} else {
			this.fireDetailChanged(sEntityPath);
		}
        Glob_P = this.getView().byId("status").getText();
        var oTyp = this.byId("Typ");
        oTyp.setSelectedKey("");
        var oFarbe = this.byId("Farbe");
        oFarbe.setSelectedKey("");
        var oStoff = this.byId("Stoff");
        oStoff.setSelectedKey(" ");
        var oKissen = this.byId("Kissen");
        oKissen.setSelectedKey("");
        Glob_T=""; Glob_F=""; Glob_B=""; Glob_K="";
        var Krit = this._Path();
        this._filter ("FIORI_PRG", "MTEXT", Glob_P);
        this._filter ("FIORI_TYP", "Typ", Krit);
        this._filter ("FIORI_FARBE", "Farbe", Krit);
        this._filter ("FIORI_BEZUGSSTOFF", "Stoff", Krit);
        this._filter ("FIORI_KISSEN_ANZ", "Kissen", Krit);
        this._filter ("FIORI_PREIS", "Preis", Krit);
  
	},

	showEmptyView: function() {
		this.getRouter().myNavToWithoutHash({
			currentView: this.getView(),
			targetViewName: "Variantconf.view.NotFound",
			targetViewType: "XML"
		});
	},

	fireDetailChanged: function(sEntityPath) {
		this.getEventBus().publish("Detail", "Changed", {
			sEntityPath: sEntityPath
		});
	},

	fireDetailNotFound: function() {
		this.getEventBus().publish("Detail", "NotFound");
	},

	onNavBack: function() {
		// This is only relevant when running on phone devices
		this.getRouter().myNavBack("main");
	},

	onDetailSelect: function(oEvent) {
		sap.ui.core.UIComponent.getRouterFor(this).navTo("detail", {
			entity: oEvent.getSource().getBindingContext().getPath().slice(1),
			tab: oEvent.getParameter("selectedKey")
		}, true);
	},

	openActionSheet: function() {

		if (!this._oActionSheet) {
			this._oActionSheet = new sap.m.ActionSheet({
				buttons: new sap.ushell.ui.footerbar.AddBookmarkButton()
			});
			this._oActionSheet.setShowCancelButton(true);
			this._oActionSheet.setPlacement(sap.m.PlacementType.Top);
		}

		this._oActionSheet.openBy(this.getView().byId("actionButton"));
	},

	getEventBus: function() {
		return sap.ui.getCore().getEventBus();
	},

	getRouter: function() {
		return sap.ui.core.UIComponent.getRouterFor(this);
	},
	
    onChange: function(oEvent) {
    var Krit; //declares the variable for criteria 
    var Temp = oEvent.getParameter("selectedItem").getId(); //obtains the Id of the controller
        if (Temp.match(/Typ/)) {Glob_T = oEvent.getParameter("selectedItem").getKey();  // Based on ID, the global variable is updated
                                Krit = this._Path(); // Based on new value of global variable, the criteria is updated
                                this._filter ("FIORI_FARBE", "Farbe", Krit); // The list of the next step is populated
                                oImage = this.byId("odata_img01"); // image is placed
                                oImage.setSrc(gl_imgpath);
            
        }    else if (Temp.match(/Farbe/)) { Glob_F = oEvent.getParameter("selectedItem").getKey();
                                            Krit = this._Path();
                                            this._filter ("FIORI_BEZUGSSTOFF", "Stoff", Krit);
                                            oImage = this.byId("odata_img02");
                                            oImage.setSrc(gl_imgpath);
                                            
        }          else if (Temp.match(/Stoff/)) { Glob_B = oEvent.getParameter("selectedItem").getKey();
                                                    Krit = this._Path();
                                                    this._filter ("FIORI_KISSEN_ANZ", "Kissen", Krit);
                                                    oImage = this.byId("odata_img03");
                                                    oImage.setSrc(gl_imgpath);
 
        }               else if (Temp.match(/Kissen/)) { Glob_K = oEvent.getParameter("selectedItem").getKey();
                                                        Krit = this._Path();
                                                        oImage = this.byId("odata_img04");
                                                        oImage.setSrc(gl_imgpath);

        }
                            else {alert("not found!");}
                            this._filter ("FIORI_PREIS", "Preis", Krit); // The pricing procedure is carried out

    },	

    _Path: function () { // this function updates the global declared variables for path (image and selector)
    var oCrit = "SKRIT_FIORI_PRG=" + Glob_P;
    oCrit = oCrit + "___SKRIT_FIORI_TYP=" + Glob_T;
    oCrit = oCrit + "___SKRIT_FIORI_FARBE=" + Glob_F;
    oCrit = oCrit + "___SKRIT_FIORI_BEZUGSSTOFF=" + Glob_B;
    oCrit = oCrit + "___SKRIT_FIORI_KISSEN_ANZ=" + Glob_K;
    
    gl_imgpath = "/sap/opu/odata/sap/ZUI5_TEST_TVC_SRV/ZUI5_TEST_TVALUES_SET(ATNAM='FIORI_JPEG',ATWRT='";
    gl_imgpath = gl_imgpath + Glob_P + "_";
    gl_imgpath = gl_imgpath + Glob_T + "_";
    gl_imgpath = gl_imgpath + Glob_F + "_";
    gl_imgpath = gl_imgpath + Glob_B;
    gl_imgpath = gl_imgpath + "')/$value";
    
    return oCrit;
    },

    _filter: function (oName, oID, okrit){ // this function updates the list according to values passed
    var oFilter = new sap.ui.model.Filter("ATNAM", "EQ", oName);
    var oFilter2 = new sap.ui.model.Filter("ATWRT", sap.ui.model.FilterOperator.EQ, okrit);
    var allFilter = new sap.ui.model.Filter([oFilter, oFilter2], true);
    var oBinding_T = this.byId(oID).getBinding("items");
    oBinding_T.filter([allFilter]);
  },

// this function obtains the current values in the list obtained by oData service
// is usefull for validating the allowed values or automatizing the unique values
    _retrieve: function(oID){
    var oItems = this.getView().byId(oID).getItems();
    var oItemsKey = [];
    for(var i=0;i<oItems.length;i++){
    oItemsKey.push(oItems[i].getKey()); 
                                    }
    return oItemsKey;
    },

//With this function, the allowed values are verified. Single values are automatically selected in list
    _validate: function(oArray, oSelect, oID) {
        var Krit; //declares the variable for criteria 
        var oList = this.byId(oID); //instantiates the list to the variable oList
        if(oArray.length === 1)  {  // this is the case if the odata has delivered only one value
			    var oKey = $.map(this.byId(oID).getItems(), function (item) { return item.getKey(); } );
				oList.setSelectedKey(oKey); //assigns the value to the list
				switch (oID) { // assigns the value of global variable since the user does not make any selection
					case "Typ": Glob_P = oKey[0]; 
					            Krit = this._Path();
					            this._filter ("FIORI_PREIS", "Preis", Krit); // The pricing procedure is carried out
						break;
                    case "Farbe": Glob_F = oKey[0];
                                    Krit = this._Path();
					                this._filter ("FIORI_PREIS", "Preis", Krit); // The pricing procedure is carried out
						break;
					case "Stoff": Glob_B = oKey[0];
					                Krit = this._Path();
					                this._filter ("FIORI_PREIS", "Preis", Krit); // The pricing procedure is carried out
						break;
                    case "Kissen": Glob_K = oKey[0];
                                    Krit = this._Path();
					                this._filter ("FIORI_PREIS", "Preis", Krit); // The pricing procedure is carried out
						break;
					default: alert("no global variable?");
				}
        } else {
            for(var i=0;i<oArray.length;i++){
                if (oArray[i] === oSelect)  {oList.setSelectedKey(oSelect);  break; }
                oList.setSelectedKey("");
                }
            }
    },
    
	onSelectChanged: function(oEvent) {

		var key = oEvent.getParameters().key;
		if (key === '2') {
            oImage = this.byId("odata_img01");
            oImage.setSrc(gl_imgpath);

		} else if (key === '3') {
		var oList = this._retrieve("Farbe");
		this._validate(oList, Glob_F, "Farbe");
            oImage = this.byId("odata_img02");
            oImage.setSrc(gl_imgpath);

		} else if (key === '4') {
		    oList = this._retrieve("Stoff");
		    this._validate(oList, Glob_B, "Stoff");
			oImage = this.byId("odata_img03");
			oImage.setSrc(gl_imgpath);

		} else if (key === '5') {
            oImage = this.byId("odata_img04");
            oImage.setSrc(gl_imgpath);

		}
	},
	
	onExit: function(oEvent) {
		var oEventBus = this.getEventBus();
		oEventBus.unsubscribe("Master", "InitialLoadFinished", this.onMasterLoaded, this);
		oEventBus.unsubscribe("Component", "MetadataFailed", this.onMetadataFailed, this);
		if (this._oActionSheet) {
			this._oActionSheet.destroy();
			this._oActionSheet = null;
		}
	}
});