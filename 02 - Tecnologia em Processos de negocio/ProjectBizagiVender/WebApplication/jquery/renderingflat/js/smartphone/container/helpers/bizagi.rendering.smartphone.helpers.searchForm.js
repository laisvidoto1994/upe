/*
 *   Name: BizAgi Smartphone Search Slide Implementation
 *   Author: Oscar Osorio
 *   Comments:
 *   -   This script will shows a  search form
 */
$.Class.extend("bizagi.rendering.smartphone.helpers.searchForm", {}, {
    /* 
     *   Constructor
     */
  init: function (dataService, renderFactory, searchForms, searchParams, searchFormParams) {
    //var self = this;
    this.dataService = dataService;
    this.renderFactory = renderFactory;
    this.searchForms = searchForms;
    this.searchParams = searchParams;
    this.searchFormParams = searchFormParams;
    this.searchFormDeferred = new $.Deferred();
  },

  /**
   * Render the edition form,... if is an addform, then show the currentAddForm view
   * */
  renderEdition: function (params) {
    var self = this;
    self.properties = params;

    //Render the search form
    self.renderSearchForm(params);

    // Return promise
    return self.searchFormDeferred.promise();
  },

  /**
   * get the searchform and render it!
   * */
  renderSearchForm: function (params) {
    var self = this;

    $.when(self.getSearchContainerData(params)).then(function (data) {
      if (params.editable === false) {
        data.form.properties.editable = false;
      }

      if (data.form.properties){
        data.form.properties.orientation = self.searchParams.orientation || "ltr";
      }

      var form = self.renderFactory.getContainer($.extend({}, self.searchFormParams, {
        type: "form",
        data: data.form,
        navigation: self.searchFormParams.navigation
      }));

      self.form = form;

      var keys = Object.keys(form.children);
      keys.map(function(key){
        form.children[key].params = $.extend({}, form.children[key].params, self.searchFormParams);
      });

      return form.render();

    },function (message) {
      var errorTemplate = self.renderFactory.getCommonTemplate("form-error");
      $.tmpl(errorTemplate, { message: message }).appendTo(slideForm.find(".scroll-content"));
    }).done(function (element) {
      var tabContainer = self.form.firstChild().properties.type === "tab" ? self.form.firstChild() : null;
      if (tabContainer) {
        // Bind select tab event
        tabContainer.bind("selected", function (e, ui) {
          var searchForm = self.searchForms[ui.index];
          $.when(self.loadSearchTab(params, ui.tab, searchForm))
            .done(function () {
              // Set currents search form
              self.currentSearchForm = ui.tab.firstChild();
              self.currentSearchForm.triggerHandler("ondomincluded");
            });
        });

        tabContainer.container.tabs("select", 0);
        self.currentSearchForm = tabContainer.firstChild().firstChild();

        if (!self.currentSearchForm.readyDeferred) {
          self.currentSearchForm.readyDeferred = new $.Deferred();
        }

        self.currentSearchForm.triggerHandler("ondomincluded");
      } else {
        // Set currents search form
        self.currentSearchForm = self.form.firstChild();

        if (!self.currentSearchForm.readyDeferred) {
          self.currentSearchForm.readyDeferred = new $.Deferred();
        }

        self.currentSearchForm.triggerHandler("ondomincluded");
      }

      // Creates a container, be careful you must destroy it later
      var container = self.searchFormParams.navigation.createRenderContainer({title: params.displayName});
      container.element.html(element);
      self.searchFormParams.navigation.navigate(container.id);

      self.containerGridResults = self.currentSearchForm.container.find("#bz-rn-sf-gr-results");
      self.containerSearchCriteria = self.currentSearchForm.container.find(".ui-bizagi-container-search-criteria");
      self.applyButtons(container);
      self.displayBottomButtons(container);
    });
  },

  /**
   * Get the addform and show it
   * */
  renderAddForm: function(params){
    var self = this;
    params = params || {};
    var properties = self.properties;

    if (!self.addContainer){
      self.addContainer = self.searchFormParams.navigation.createRenderContainer({title : ""});
    }else{
      self.addContainer.element.empty();
    }

    var isRefresh = params.isRefresh || false;

    params = $.extend(params, {
      "allowFullSearch": properties.allowFullSearch,
      "maxRecords": properties.maxRecords,
      "requestedForm": "addForm",
      "xpathContext": properties.xpathContext,
      "contextType": "entity"
    });

    //Get the addform
    $.when(self.dataService.getFormData(params))
      .then(function(data){
      if (params.editable === false) {
        data.form.properties.editable = false;
      }

      if (typeof (data.form.properties) !== "undefined"){
        data.form.properties.orientation = self.searchParams.orientation || "ltr";
      }

      data.form.contextType = "entity";

      var form = self.renderFactory.getContainer($.extend({}, self.addFormParams, {
        type: "form",
        data: data.form,
        focus: params.focus || false,
        selectedTabs: params.selectedTabs,
        isRefresh: isRefresh,
        requestedForm: params.requestedForm,
        navigation: self.searchFormParams.navigation
      }));

      form.buttons = [
        $.extend(
          self.form.buttons[0] || {},
          {
            "caption": bizagi.localization.getResource("render-form-dialog-box-save"),
            "actions": ["submitData", "refresh"],
            "submitData": true,
            "refresh": true,
            "ordinal": 0,
            "action": "save",
            "save": true,
            "style": "",
          },
          {
            //This callback avoid to call the default processButton in the form
            callback: function () {
              // When the data is saved then
              self.saveDataAddForm(form).done(function () {
                self.addContainer.destroy();
                delete self.addContainer;
              });
            },
          }),
        $.extend(
          self.form.buttons[1] || {},
          {
            "caption": bizagi.localization.getResource("render-form-dialog-box-close"),
            "actions": ["submitData", "refresh"],
            "submitData": true,
            "refresh": true,
            "ordinal": 1,
            "action": "back",
            "save": true,
            "style": "",
          },
          {
            //This callback avoid to call the default processButton in the form
            callback: function () {
              self.addContainer.destroy();
              delete self.addContainer;
            },
          }),
      ];

      $.extend(form, {
        processButtons: function() {
          //not send information set in memory and save
          $.each(form.buttons, function(index, element) {
            switch (element["ordinal"]) {
              case 1: //next button will behave as a cancel button
                $(form.getButtons()[index]).click(function() {
                  self.addContainer.destroy();
                  delete self.addContainer;
                });
                form.getButtons()[index].innerHTML = bizagi.localization.getResource("render-form-dialog-box-close");
                form.buttons[index].caption = bizagi.localization.getResource("render-form-dialog-box-close");
                form.buttons[index].action = "back";
                break;

              default:
                $(form.getButtons()[index]).click(function() {
                  self.saveDataAddForm(form);
                  self.addContainer.destroy();
                  delete self.addContainer;
                });
                break;
            }
          });
        }
      });

      for (var indicator in form.children) {
        form.children[indicator].params = $.extend({}, form.children[indicator].params, self.addFormParams);
      }

      return $.when(form.render()).done(function(element){
        // Set currents search form
        self.currentAddForm = form.firstChild();

        self.addContainer.element.html(element);
        if (!isRefresh){
          self.searchFormParams.navigation.navigate(self.addContainer.id);
        }

        self.searchFormParams.navigation.setNavigationButtons(form);

        form.triggerHandler("ondomincluded");

        // if is any modal view displayed, hide it to allow this search form been displayed
        self.handleSearchFormZindex("show");

        form.bind("refresh", function (_, refreshParams) {
          refreshParams.scrollTop = self.form.container.parent().scrollTop();
          refreshParams = $.extend({
            focus: focus,
            selectedTabs: self.form.getSelectedTabs(),
            isRefresh: true,
            contextType: self.properties.contextType || "",
            idPageCache : form.idPageCache,
            navigation: self.searchFormParams.navigation
          }, refreshParams);

          return self.renderAddForm(refreshParams);
        });
      });
    }).fail(function(e){
      self.addContainer.destroy();
      delete self.addContainer;
      console.log("there is an error :(");
    });
  },

  saveDataAddForm: function (form) {
    var self = this;
    var properties = self.properties;
    var defer = $.Deferred();
    if (form.validateForm()) {
      var data = {};
      $.forceCollectData = true;

      form.collectRenderValues(data);
      data.idPageCache = form.idPageCache;

      var params = {
        action: "SAVE",
        data: data,
        idPageCache: data.idPageCache,
        guidEntity: form.properties.entity,
        contexttype: 'entity',
      };

      // Check if the add form has data
      var formData = {};

      form.collectRenderValuesForSubmit(formData);

      // Turn off flag
      $.forceCollectData = false;

      if (!bizagi.util.isMapEmpty(formData)) {
        $.when(self.dataService.submitData(params))
          .done(function (response) {
            function dataHasXpath(xpath) {
              var render = self.currentSearchForm.getRender(xpath);
              if (typeof render == "object" && render != null) {
                return { "found": true, "obj": render };
              }
              return { "found": false, "obj": {} };
            }
            for (var i in formData) {
              var mapping = dataHasXpath(i);
              if (mapping.found) {
                mapping.obj.setValue(formData[i]);
                self.setDisplayValueToControl(mapping.obj, form, i, formData);
              }
            }

            self.currentSearchForm.performSearch({
              allowFullSearch: properties.allowFullSearch,
              maxRecords: properties.maxRecords
            });

            defer.resolve();
              /*       if (self.currentSearchForm.resultsGrid.properties.data !== null &&
               !jQuery.isEmptyObject(self.currentSearchForm.resultsGrid.properties.data.rows) &&
               self.currentSearchForm.resultsGrid.properties.data.rows.length > 0) {
               self.searchResultContainer.show();
               self.currentSearchForm.container.find(".bz-btn-search").show();
               self.currentSearchForm.container.find(".bz-btn-select").hide();
               self.containerGridResults.hide();

               }*/
          })
          .fail(function (jqXHR, type, message) {
            form.addValidationMessage(message.message);
            defer.reject();
          });
      } else {
        // Form has not data
        bizagi.showMessageBox(bizagi.localization.getResource("render-search-advanced-no-filters"));
        defer.reject();
      }
    }
    else {
      defer.reject();
    }
    return defer;
  },

    /***
     * Set display value by control type, when add new record
     * @param renderControlSearchForm
     * @param addForm
     * @param xpath
     * @param formData
     */
    setDisplayValueToControl: function (renderControlSearchForm, addForm, xpath, formData){
        if(renderControlSearchForm.properties.type === "searchSuggest"){
            renderControlSearchForm.setDisplayValue(addForm.getRender(xpath).getDisplayValue());
        }
        else{
            renderControlSearchForm.setDisplayValue(formData[xpath]);
        }
    },
  /**
   * configure searchform buttons
   * */
  applyButtons: function (container) {
    var self = this;

    self.displayBottomButtons(container);

    container.element.bind("close", function () {
      self.searchFormDeferred.reject();
    });
  },

  loadSearchTab: function (params, tab, searchForm) {
    var self = this;
    var defer = new $.Deferred();
    // If the tab has children it is loaded already
    if (tab.children.length > 0) {
      return null;
    }
    // Load search form data
    $.when(self.getSearchFormData(params, searchForm))
      .pipe(function (data) {
        // Render data inside selected tab
        var searchFormContainer = self.renderFactory.getContainer({
          type: "searchForm",
          data: data.form
        });
        tab.children.push(searchFormContainer);
        return searchFormContainer.render();
      })
      .done(function (element) {
        // Remove button container
        $(".ui-bizagi-button-container", element).detach();
        tab.container.append(element);
        defer.resolve();
      });
    return defer.promise();
  },

  getSearchContainerData: function (params) {
    var self = this;
    var deferred = new $.Deferred();
    var data = {
      form: {
        properties: {},
        elements: []
      }
    };
    var container = data.form;
    var searchFormToLoad = self.searchForms[0];
    // When there are more than one search form, render a tab container
    if (self.searchForms.length > 1) {
      var tabContainer = {};
      tabContainer.properties = {
        type: "tab"
      };
      tabContainer.elements = [];
      var otherElements = [];
      $.each(self.searchForms, function (i, searchForm) {
        var isDefault = searchForm["default"] || false;
        // Create tab item
        var tab = {};
        tab.properties = {
          id: i,
          type: "tabItem",
          displayName: searchForm.caption
        };
        tab.elements = [];
        // Append children
        if (isDefault) {
          tabContainer.elements.push({
            container: tab
          });
          // Set properties to load default container
          container = tab;
          searchFormToLoad = self.searchForms[0];
        } else {
          otherElements.push({
            container: tab
          });
        }
      });

      // Append no defaults elements
      $.each(otherElements, function (i, element) {
        tabContainer.elements.push(element);
      });
      data.form.elements.push({
        container: tabContainer
      });
    }

    // Loads default form
    $.when(self.getSearchFormData(params, searchFormToLoad))
      .done(function (searchFormData) {
        container.elements.push(searchFormData);
        container.properties.id = Math.guid();

        // Resolve deferred
        deferred.resolve(data);
      });
    return deferred.promise();
  },

  getSearchFormData: function (params, searchForm) {
    var self = this;
    return self.dataService.getSearchFormData($.extend(params, {
      idSearchForm: searchForm.id,
      url: searchForm.url
    })).pipe(function (data) {
      // Append search render properties
      data.form.properties.idRender = params.idRender;
      return data;
    });
  },

  displayBottomButtons: function (container) {
    var self = this;
    var containerButtons = self.currentSearchForm.container.find(".ui-bizagi-container-button-edit").empty().show();
    var templateBtn = "<button class='ui-bizagi-form-button #= data.name #'> #= data.text # </button>";
    var btnSearch = $.tmpl(templateBtn, { name: "bz-btn-search", text: bizagi.localization.getResource("render-form-dialog-box-search") }).appendTo(containerButtons);
    var btnSelect = $.tmpl(templateBtn, { name: "bz-btn-select", text: bizagi.localization.getResource("render-search-advanced-results-button") }).appendTo(containerButtons);
    var btnAdd = $.tmpl(templateBtn, { name: "bz-btn-add", text: bizagi.localization.getResource("render-form-dialog-box-add") }).appendTo(containerButtons);
    var btnCancel = $.tmpl(templateBtn, { name: "bz-btn-cancel", text: bizagi.localization.getResource("render-form-dialog-box-cancel") }).appendTo(containerButtons);

    var setSearchState = function setSearchButtons() {

      // List posible buttons for search
      var buttons = [
        {
          "ordinal": 1,
          "action": "search",
          "caption": bizagi.localization.getResource("render-form-dialog-box-search"),
          "callback": function () {
            // The Grid only support one row per page in smartphone (DRAGON-41733 / QAF-3916)
            self.searchParams.maxRows = 1;
            self.currentSearchForm.performSearch(self.searchParams);
          },
        },
        {
          "ordinal": 2,
          "action": "cancel",
          "caption": "cancel",
          "callback": function () {
            self.searchFormDeferred.reject();
            container.destroy();
          },
        },
        {
          "ordinal": 3,
          "action": "add",
          "caption": bizagi.localization.getResource("render-form-dialog-box-add"),
          "callback": function () {
            var params = {
              "idCase": self.searchFormParams.idCase,
              "idRender": self.properties.idRender,
              "displayName": self.properties.displayName,
              "idPageCache": self.properties.idPageCache,
            };

            self.renderAddForm(params);
          },
        },
      ];

      self.containerSearchCriteria.show();
      self.containerGridResults.hide();

      // Add only seen when allowed
      $(btnAdd).toggle(self.searchParams.allowNew);
      btnSearch.show();
      btnSelect.hide();

      if(!self.searchParams.allowNew) {
        buttons.pop();
      }

      self.form.buttons = buttons;
      self.searchFormParams.navigation.setNavigationButtons(self.form);
    };

    var setResultState = function setSearchButtons() {

      // List posible buttons for result
      var buttons = [
        {
          "ordinal": 4,
          "action": "select",
          "caption": bizagi.localization.getResource("render-search-advanced-results-button"),
          "callback": function () {
            self.searchFormDeferred.resolve(container.element.find("#bz-rn-sf-gr-results [data-key]").data("business-key"));
            container.destroy();
          },
        },

        {
          "ordinal": 5,
          "action": "cancel",
          "caption": "cancel",
          "callback": function () {
            setSearchState();
          },
        },

        {
          "ordinal": 3,
          "action": "add",
          "caption": bizagi.localization.getResource("render-form-dialog-box-add"),
          "callback": function () {
            var params = {
              "idCase": self.searchFormParams.idCase,
              "idRender": self.properties.idRender,
              "displayName": self.properties.displayName,
              "idPageCache": self.properties.idPageCache,
            };

            self.renderAddForm(params);
          },
        },
      ];

      self.containerSearchCriteria.hide();
      self.containerGridResults.show();

      // Add only seen when allowed
      $(btnAdd).toggle(self.searchParams.allowNew);
      btnSearch.hide();
      btnSelect.show();

      if(!self.searchParams.allowNew) {
        buttons.pop();
      }

      self.form.buttons = buttons;
      self.searchFormParams.navigation.setNavigationButtons(self.form);
    };

    btnSearch.bind("click", function () {
      // The Grid only support one row per page in smartphone (DRAGON-41733 / QAF-3916)
      self.searchParams.maxRows = 1;
      self.currentSearchForm.performSearch(self.searchParams);
    });

    btnAdd.bind("click", function () {
      var params = {
        "idCase": self.searchFormParams.idCase,
        "idRender": self.properties.idRender,
        "displayName": self.properties.displayName,
        "idPageCache": self.properties.idPageCache
      };

      self.renderAddForm(params);
    });

    btnCancel.bind("click", function () {
        /*if(self.searchFormParams.navigation) {
         self.searchFormParams.navigation.removeLastSuscriber();
         self.searchFormParams.navigation.changeContextualButtons("dynamic");
         }

         self.handleSearchFormZindex("hide");*/
      self.searchFormDeferred.reject();
      container.destroy();
    });

    btnSelect.bind("click", function () {
      self.searchFormDeferred.resolve(container.element.find("#bz-rn-sf-gr-results [data-key]").data("business-key"));
      container.destroy();
    });

    self.currentSearchForm.bind("instancerefreshdone", function () {
      // Show search results container
      if (self.currentSearchForm.resultsGrid.properties.data !== null &&
        !jQuery.isEmptyObject(self.currentSearchForm.resultsGrid.properties.data.rows ) &&
        self.currentSearchForm.resultsGrid.properties.data.rows.length > 0
      ) {
        setResultState();
      }
      else {
        setSearchState();
      }
    });

    setSearchState();
  },

  renderEditionAddForm: function (params) {
    var self = this;
    var properties = self.properties;
    var container = $(params.id + " .inputEditionContent");
    var canvas = $(params.id + " .inputEditionContent");
    var kendoView = $(params.id, "body");

    self.viewContainer = params.viewContainer;

    self.addFormParams = {
      container: container,
      canvas: canvas,
      kendoView: kendoView,
      allowFullSearch: properties.allowFullSearch,
      maxRecords: properties.maxRecords,
      allowNew: false
    };

    self.renderEdition({
      "idRender": properties.idRender,
      "requestedForm": "addForm",
      "xpathContext": properties.xpathContext,
      "idPageCache": properties.idPageCache,
      "isAddForm": true,
      "contextType": "entity"
    }).done(function () {
      if (self.form.validateForm()) {
        var data = {};
        $.forceCollectData = true;

        self.form.collectRenderValues(data);
        data.idPageCache = self.form.idPageCache;
        var defer = $.Deferred();

        var params = {
          action: "SAVE",
          data: data,
          idPageCache: data.idPageCache,
          guidEntity: self.form.properties.entity,
          contexttype: "entity"
        };

        // Check if the add form has data
        var formData = {};

        self.form.collectRenderValuesForSubmit(formData);

        // Turn off flag
        $.forceCollectData = false;

        if (!bizagi.util.isMapEmpty(formData)) {
          self.pane.navigate("#:back");
          $.when(self.dataService.submitData(params)).done(function (response) {
            function dataHasXpath(xpath) {
              var render = self.currentSearchForm.getRender(xpath);

              if (typeof render == "object" && render !== null) {
                return { "found": true, "obj": render };
              }

              return { "found": false, "obj": {} };
            }

            for (var i in formData) {
              var mapping = dataHasXpath(i);
              if (mapping.found) {
                var value = data[i];
                mapping.obj.setValue(value);
                mapping.obj.setDisplayValue(value);

                if (self.currentSearchForm.resultsGrid.properties.data !== null &&
                  !jQuery.isEmptyObject(self.currentSearchForm.resultsGrid.properties.data.rows) &&
                  self.currentSearchForm.resultsGrid.properties.data.rows.length > 0) {
                  self.containerSearchCriteria.show();
                  self.currentSearchForm.container.find(".bz-btn-search").show();
                  self.currentSearchForm.container.find(".bz-btn-select").hide();
                  self.containerGridResults.hide();
                }
              }
            }
          }).fail(function (jqXHR, type, message) {
            if (type == "parsererror") {
              defer.resolve({
                type: "error",
                message: message.message
              });
            } else {
              defer.reject(arguments);
            }
          });
        } else {
          // Form has not data
          bizagi.showMessageBox(bizagi.localization.getResource("render-search-advanced-no-filters"));
        }
      }
    }).fail(function () {
      self.pane.navigate("#:back");
    });

    self.pane.navigate(params.id);
  },

  handleSearchFormZindex: function (option) {
    var self = this;

    //if there is an open modal, change z-index to make searchForm visible
    var modalViewDisplayed = jQuery.grep($(".km-modalview-root"), function (n, i) {
      return ($(n).css("display") == "block");
    });

    if (modalViewDisplayed.length > 0) {
      if (option == "show") {
        $(modalViewDisplayed).css("z-index", 0);
      } else {
        $(modalViewDisplayed).css("z-index", 10001);
      }
    }
  }
});