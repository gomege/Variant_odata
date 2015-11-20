jQuery.sap.declare("Variantconf.Component");
jQuery.sap.require("Variantconf.MyRouter");

sap.ui.core.UIComponent.extend("Variantconf.Component", {
	metadata : {
		name : "Z_Variant_Odata",
		version : "1.0",
		includes : [],
		dependencies : {
			libs : ["sap.m", "sap.ui.layout"],
			components : []
		},

		rootView : "Variantconf.view.App",

		config : {
			resourceBundle_en : "i18n/messageBundle_en.properties",
			resourceBundle_de : "i18n/messageBundle_de.properties",
			serviceConfig : {
				name: "ZUI5_TEST_TVC_SRV",
				serviceUrl: "/sap/opu/odata/sap/ZUI5_TEST_TVC_SRV/"
			}
		},

		routing : {
			config : {
				routerClass : Variantconf.MyRouter,
				viewType : "XML",
				viewPath : "Variantconf.view",
				targetAggregation : "detailPages",
				clearTarget : false
			},
			routes : [
				{
					pattern : "",
					name : "main",
					view : "Master",
					targetAggregation : "masterPages",
					targetControl : "idAppControl",
					subroutes : [
						{
							pattern : "{entity}/:tab:",
							name : "detail",
							view : "Detail"
						}
					]
				},
				{
					name : "catchallMaster",
					view : "Master",
					targetAggregation : "masterPages",
					targetControl : "idAppControl",
					subroutes : [
						{
							pattern : ":all*:",
							name : "catchallDetail",
							view : "NotFound",
							transition : "show"
						}
					]
				}
			]
		}
	},

	init : function() {
		sap.ui.core.UIComponent.prototype.init.apply(this, arguments);

		var mConfig = this.getMetadata().getConfig();

		// Always use absolute paths relative to our own component
		// (relative paths will fail if running in the Fiori Launchpad)
		var oRootPath = jQuery.sap.getModulePath("Variantconf");

		// Set i18n model according to language
		var oLang = jQuery.sap.getUriParameters().get("sap-ui-language");
		var i18nModel;
		switch (oLang) { // according to language proceeds
					case "en":  i18nModel = new sap.ui.model.resource.ResourceModel({
			                    bundleUrl : [oRootPath, mConfig.resourceBundle_en].join("/")
		                        }); this.setModel(i18nModel, "i18n");
						break;
                    case "de": i18nModel = new sap.ui.model.resource.ResourceModel({
			                    bundleUrl : [oRootPath, mConfig.resourceBundle_de].join("/")
		                        }); this.setModel(i18nModel, "i18n"); 
						break;
					default: alert("no language?");
				}

		var sServiceUrl = mConfig.serviceConfig.serviceUrl;

		//This code is only needed for testing the application when there is no local proxy available
		var bIsMocked = jQuery.sap.getUriParameters().get("responderOn") === "true";
		// Start the mock server for the domain model
		if (bIsMocked) {
			this._startMockServer(sServiceUrl);
		}

		// Create and set domain model to the component
		var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, {json: true,loadMetadataAsync: true});
		oModel.attachMetadataFailed(function(){
            this.getEventBus().publish("Component", "MetadataFailed");
		},this);
		this.setModel(oModel);

		// Set device model
		var oDeviceModel = new sap.ui.model.json.JSONModel({
			isTouch : sap.ui.Device.support.touch,
			isNoTouch : !sap.ui.Device.support.touch,
			isPhone : sap.ui.Device.system.phone,
			isNoPhone : !sap.ui.Device.system.phone,
			listMode : sap.ui.Device.system.phone ? "None" : "SingleSelectMaster",
			listItemType : sap.ui.Device.system.phone ? "Active" : "Inactive"
		});
		oDeviceModel.setDefaultBindingMode("TwoWay");
		this.setModel(oDeviceModel, "device");

		this.getRouter().initialize();
	},

	_startMockServer : function (sServiceUrl) {
		jQuery.sap.require("sap.ui.core.util.MockServer");
		var oMockServer = new sap.ui.core.util.MockServer({
			rootUri: sServiceUrl
		});

		var iDelay = +(jQuery.sap.getUriParameters().get("responderDelay") || 0);
		sap.ui.core.util.MockServer.config({
			autoRespondAfter : iDelay
		});

		oMockServer.simulate("model/metadata.xml", "model/");
		oMockServer.start();


		sap.m.MessageToast.show("Running in demo mode with mock data.", {
			duration: 4000
		});
	},

	getEventBus : function () {
		return sap.ui.getCore().getEventBus();
	}
});