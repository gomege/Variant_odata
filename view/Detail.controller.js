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
				oStoff.setSelectedKey("");
				var oKissen = this.byId("Kissen");
				oKissen.setSelectedKey("");
				Glob_T=""; Glob_F=""; Glob_B=""; Glob_K="";
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
        var oFilter1T = new sap.ui.model.Filter("ATNAM", "EQ", "FIORI_PRG");
        var oFilter2T = new sap.ui.model.Filter("ATWRT", "EQ", Glob_P);
        var allFilterT = new sap.ui.model.Filter([oFilter1T, oFilter2T], true);
        var oBindingT = this.byId("MTEXT").getBinding("items");
        oBindingT.filter([allFilterT]); 
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
	
    onChange_T: function(oEvent) {
    var MyVariable = oEvent.getParameter("selectedItem").getKey();
    Glob_T = MyVariable;
    gl_imgpath = "/sap/opu/odata/sap/ZUI5_TEST_TVC_SRV/ZUI5_TEST_TVALUES_SET(ATNAM='FIORI_JPEG',ATWRT='";
    gl_imgpath = gl_imgpath + Glob_P + "_";
    gl_imgpath = gl_imgpath + Glob_T + "_";
    gl_imgpath = gl_imgpath + Glob_F + "_";
    gl_imgpath = gl_imgpath + Glob_B;
    gl_imgpath = gl_imgpath + "')/$value";
    oImage = this.byId("odata_img01");
    oImage.setSrc(gl_imgpath);
    },	

	onChange_F: function(oEvent) {
		var MyVariable = oEvent.getParameter("selectedItem").getKey();
		Glob_F = MyVariable;
        gl_imgpath = "/sap/opu/odata/sap/ZUI5_TEST_TVC_SRV/ZUI5_TEST_TVALUES_SET(ATNAM='FIORI_JPEG',ATWRT='";
        gl_imgpath = gl_imgpath + Glob_P + "_";
        gl_imgpath = gl_imgpath + Glob_T + "_";
        gl_imgpath = gl_imgpath + Glob_F + "_";
        gl_imgpath = gl_imgpath + Glob_B;
        gl_imgpath = gl_imgpath + "')/$value";
        oImage = this.byId("odata_img02");
        oImage.setSrc(gl_imgpath);
	},

	onChange_S: function(oEvent) {
		var MyVariable = oEvent.getParameter("selectedItem").getKey();
		Glob_B = MyVariable;
		        gl_imgpath = "/sap/opu/odata/sap/ZUI5_TEST_TVC_SRV/ZUI5_TEST_TVALUES_SET(ATNAM='FIORI_JPEG',ATWRT='";
        gl_imgpath = gl_imgpath + Glob_P + "_";
        gl_imgpath = gl_imgpath + Glob_T + "_";
        gl_imgpath = gl_imgpath + Glob_F + "_";
        gl_imgpath = gl_imgpath + Glob_B;
        gl_imgpath = gl_imgpath + "')/$value";
        oImage = this.byId("odata_img03");
        oImage.setSrc(gl_imgpath);
	},
	
	onChange_K: function(oEvent) {
		var MyVariable = oEvent.getParameter("selectedItem").getKey();
		Glob_K = MyVariable;
	},




	onSelectChanged: function(oEvent) {
        Glob_P = this.getView().byId("status").getText();
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
        
		var key = oEvent.getParameters().key;
		if (key === '2') {
		    Glob_P = this.getView().byId("status").getText();
		    var oFilter_T = new sap.ui.model.Filter("ATNAM", "EQ", "FIORI_TYP");
			var oBinding_T = this.byId("Typ").getBinding("items");
			oBinding_T.filter([oFilter_T]);
            oImage = this.byId("odata_img01");
            oImage.setSrc(gl_imgpath);
		} else if (key === '3') {
			var oFilter_F = new sap.ui.model.Filter("ATNAM", "EQ", "FIORI_FARBE");
			var oBinding_F = this.byId("Farbe").getBinding("items");
			oBinding_F.filter([oFilter_F]);
            oImage = this.byId("odata_img02");
            oImage.setSrc(gl_imgpath);
            
		} else if (key === '4') {
			var oFilter1 = {};
			oFilter1 = new sap.ui.model.Filter("ATNAM", sap.ui.model.FilterOperator.EQ, "FIORI_BEZUGSSTOFF");
			var oFilter2 = {};
			oFilter2 = new sap.ui.model.Filter("ATWRT", sap.ui.model.FilterOperator.EQ, oCrit);
			var allFilter = new sap.ui.model.Filter([oFilter1, oFilter2], true);
			var oBinding2 = this.byId("Stoff").getBinding("items");
			oBinding2.filter([allFilter]);
			oImage = this.byId("odata_img03");
			oImage.setSrc(gl_imgpath);
			
		} else if (key === '5') {
			var oFilter_K = new sap.ui.model.Filter("ATNAM", "EQ", "FIORI_KISSEN_ANZ");
			var oBinding_K = this.byId("Kissen").getBinding("items");
			oBinding_K.filter([oFilter_K]);
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