/**
 * Initialize desktop.widgets.project.plan.time widget and test it
 *
 * @author Elkin Fernando Siabato Cruz
 */


describe("Widget desktop.widgets.project.plan.time", function () {
    checkWorkportalDependencies();
    var widget;

    it("Environment has been defined", function (done) {
        var params = {};
        widget = new bizagi.workportal.widgets.project.plan.time(dependencies.workportalFacade, dependencies.dataService, params);

        $.when(widget.areTemplatedLoaded())
            .done(function () {
                $.when(widget.renderContent()).done(function (html) {
                    dependencies.canvas.empty();
                    dependencies.canvas.append(html);

                    widget.postRender();
                    done();
                });
            });
    });

    it("Environment has been defined with content", function (done) {
        var contentWidget = widget.getContent();
        expect(contentWidget).not.toBe("");
        done();
    });

    describe("Values Calculated", function () {
        describe("The last activity", function () {
            it("Should be the activity has greater finishDate, scenario 1", function () {
                widget.params.plan = {
                    activities: [
                        {
                            finishDate: 1438273470000 //2015/Jul/30
                        },
                        {
                            finishDate: 1427681470000 //2015/Mar/29
                        }
                    ]
                };
                var response = widget.getLastActivity(widget.params.plan.activities);
                expect(response).toEqual(widget.params.plan.activities[0]);
            });
            it("Should be the activity has greater finishDate, scenario 2", function () {
                widget.params.plan = {
                    activities: [
                        {
                            finishDate: 1427681470000 //2015/Mar/29
                        },
                        {
                            finishDate: 1438273470000 //2015/Jul/30
                        }
                    ]
                };
                var response = widget.getLastActivity(widget.params.plan.activities);
                expect(response).toEqual(widget.params.plan.activities[1]);
            });
            it("Should be the activity has greater finishDate, scenario 3", function () {
                widget.params.plan = {
                    activities: [
                        {
                            finishDate: 1427681470000 //2015/Mar/29
                        },
                        {
                            finishDate: 1438273470000 //2015/Jul/30
                        },
                        {
                            finishDate: 1438473490000 //2015/Ago/01
                        }
                    ]
                };
                var response = widget.getLastActivity(widget.params.plan.activities);
                expect(response).toEqual(widget.params.plan.activities[2]);
            });
        });
        describe("The closed date plan", function () {
            it("Should be the finishDate of the last activity", function () {
                var lastFinishDate = 1438473490000; //2015/Ago/01
                widget.params.plan = {
                    activities: [
                        {
                            finishDate: 1438273470000 //2015/Jul/30
                        },
                        {
                            finishDate: 1438473490000 //2015/Ago/01
                        },
                        {
                            finishDate: 1427681470000 //2015/Mar/29
                        }
                    ]
                };
                var closedDate = widget.getClosedDatePlan(widget.params.plan);
                expect(lastFinishDate).toBe(closedDate);
            });
            it("Should be set to object plan", function () {
                var lastFinishDate = 1438473490000; //2015/Ago/01
                widget.params.plan = {
                    activities: [
                        {
                            finishDate: 1438273470000 //2015/Jul/30
                        },
                        {
                            finishDate: 1438473490000 //2015/Ago/01
                        },
                        {
                            finishDate: 1427681470000 //2015/Mar/29
                        }
                    ]
                };
                var closedDate = widget.getClosedDatePlan(widget.params.plan);
                expect(lastFinishDate).toBe(widget.params.plan.closedDate);
            });
        });
        describe("The interval for calculated relativeTime and description difference dates", function () {
            beforeEach(function () {
                spyOn(Date, "now").and.returnValue(1432739680959); //2015/May/27
                spyOn(widget, "getDifferenceBetweenDates");
            });
            it("Should be difference between currentDate to dueDate and difference between creationDate to Now if dueDate not is null " +
            "mayor to currentDate, and plan is PENDING", function () {
                var currentDate = new Date(Date.now());
                widget.params.plan = {
                    creationDate: 1422853200000, //2015/Ene/02
                    currentState: widget.PENDING_PLAN,
                    dueDate: 1438273470000 //2015/Jul/30
                };
                widget.getIntervalOnMinutes(widget.params.plan);
                expect(widget.getDifferenceBetweenDates).toHaveBeenCalledWith(currentDate.getTime(), widget.params.plan.dueDate);
                expect(widget.getDifferenceBetweenDates).toHaveBeenCalledWith(widget.params.plan.creationDate, currentDate.getTime());

                var descriptionUnitTime = widget.getKeywordDifferenceDates(widget.params.plan);
                expect(descriptionUnitTime).toBe("remaining");

            });

            it("Should be difference between currentDate to dueDate and between creationDate to dueDate if dueDate not is null, " +
            "minor to currentDate, and plan is PENDING, and dueDate is minor to creationDate", function () {
                var currentDate = new Date(Date.now());
                widget.params.plan = {
                    creationDate: 1427681499999, //2015/Mar/30
                    currentState: widget.PENDING_PLAN,
                    dueDate: 1427681470000 //2015/Mar/29
                };

                widget.getIntervalOnMinutes(widget.params.plan);
                expect(widget.getDifferenceBetweenDates).toHaveBeenCalledWith(widget.params.plan.dueDate, widget.params.plan.creationDate);
                expect(widget.getDifferenceBetweenDates).toHaveBeenCalledWith(widget.params.plan.creationDate, currentDate.getTime());

                var descriptionUnitTime = widget.getKeywordDifferenceDates(widget.params.plan);
                expect(descriptionUnitTime).toBe("exceeded");
            });

            it("Should be difference between currentDate to dueDate and between creationDate to dueDate if dueDate not is null, " +
            "minor to currentDate, and plan is PENDING, and dueDate is mayor to creationDate", function () {
                var currentDate = new Date(Date.now());
                widget.params.plan = {
                    creationDate: 1422853200000, //2015/Ene/02
                    currentState: widget.PENDING_PLAN,
                    dueDate: 1427681470000 //2015/Mar/29
                };

                widget.getIntervalOnMinutes(widget.params.plan);
                expect(widget.getDifferenceBetweenDates).toHaveBeenCalledWith(widget.params.plan.creationDate, widget.params.plan.dueDate);
                expect(widget.getDifferenceBetweenDates).toHaveBeenCalledWith(widget.params.plan.dueDate, currentDate.getTime());

                var descriptionUnitTime = widget.getKeywordDifferenceDates(widget.params.plan);
                expect(descriptionUnitTime).toBe("exceeded");
            });

            it("Should be difference between currentDate to startDate when plan is EXECUTING and dont have dueDate", function () {
                var currentDate = new Date(Date.now());
                widget.params.plan = {
                    currentState: widget.EXECUTING_PLAN,
                    startDate: 1427681470000 //2015/Mar/29
                };
                widget.getIntervalOnMinutes(widget.params.plan);
                expect(widget.getDifferenceBetweenDates).toHaveBeenCalledWith(widget.params.plan.startDate, currentDate.getTime());

                var descriptionUnitTime = widget.getKeywordDifferenceDates(widget.params.plan);
                expect(descriptionUnitTime).toBe("opened");
            });

            it("Should be difference between dueDate to currentDate and between startDate to Now when plan is EXECUTING and have dueDate, " +
            "and dueDate mayor than currentDate", function () {
                var currentDate = new Date(Date.now());
                widget.params.plan = {
                    startDate: 1425531600000, //2015/Feb/5
                    currentState: widget.EXECUTING_PLAN,
                    dueDate: 1438273470000 //2015/Jul/30
                };
                widget.getIntervalOnMinutes(widget.params.plan);
                expect(widget.getDifferenceBetweenDates).toHaveBeenCalledWith(currentDate.getTime(), widget.params.plan.dueDate);
                expect(widget.getDifferenceBetweenDates).toHaveBeenCalledWith(widget.params.plan.startDate, currentDate.getTime());

                var descriptionUnitTime = widget.getKeywordDifferenceDates(widget.params.plan);
                expect(descriptionUnitTime).toBe("remaining");

            });

            it("Should be difference currentDate to dueDate and get difference between startDate to dueDate when plan is EXECUTING and have dueDate, " +
            "and dueDate minor than currentDate", function () {
                var currentDate = new Date(Date.now());
                widget.params.plan = {
                    currentState: widget.EXECUTING_PLAN,
                    dueDate: 1427681470000 //2015/Mar/29
                };
                widget.getIntervalOnMinutes(widget.params.plan);
                expect(widget.getDifferenceBetweenDates).toHaveBeenCalledWith(widget.params.plan.dueDate, currentDate.getTime());
                expect(widget.getDifferenceBetweenDates).toHaveBeenCalledWith(widget.params.plan.startDate, widget.params.plan.dueDate);

                var descriptionUnitTime = widget.getKeywordDifferenceDates(widget.params.plan);
                expect(descriptionUnitTime).toBe("exceeded");

            });

            it("Should be difference closedDate to startDate when plan is CLOSED", function () {
                widget.params.plan = {
                    currentState: widget.CLOSED_PLAN,
                    startDate: 1427681470000, //2015/Mar/29
                    closedDate: 1438273470000 //2015/Jul/30
                };
                var difference = widget.getIntervalOnMinutes(widget.params.plan);
                expect(widget.getDifferenceBetweenDates).toHaveBeenCalledWith(widget.params.plan.startDate, widget.params.plan.closedDate);

                var descriptionUnitTime = widget.getKeywordDifferenceDates(widget.params.plan);
                expect(descriptionUnitTime).toBe("executed");

            });
        });

        describe("The width percent bar time", function () {
            beforeEach(function () {
                spyOn(Date, "now").and.returnValue(1432739680959); //2015/May/27
            });
            it("Should be 0 when dueDate is null", function () {
                widget.params.plan = {
                    currentState: widget.PENDING_PLAN
                };
                var width = widget.getWidthBar(widget.params.plan);
                expect(width).toBe(0);

                widget.params.plan = {
                    currentState: widget.EXECUTING_PLAN
                };
                var width = widget.getWidthBar(widget.params.plan);
                expect(width).toBe(0);
            });

            it("Should be 0 when dueDate is minor to currentDate", function () {
                widget.params.plan = {
                    currentState: widget.PENDING_PLAN,
                    dueDate: 1427681470000 //2015/Mar/29
                };
                var width = widget.getWidthBar(widget.params.plan);
                expect(width).toBe(0);

                widget.params.plan = {
                    currentState: widget.EXECUTING_PLAN,
                    dueDate: 1427681470000 //2015/Mar/29
                };
                var width = widget.getWidthBar(widget.params.plan);
                expect(width).toBe(0);
            });

            it("If plan is PENDING and dueDate is mayor to currentDate" +
            "should be difference with createDate, currentDate, dueDate", function () {
                var currentDate = new Date(Date.now());
                widget.params.plan = {
                    currentState: widget.PENDING_PLAN,
                    creationDate: 1427681470000, //2015/Mar/29
                    dueDate: 1438273470000 //2015/Jul/30
                };
                var intervalMinutes = {
                    minutesCreateToNow: 20,
                    minutesToShowTime: 90
                }
                var widthBar = widget.getWidthBar(widget.params.plan, intervalMinutes);
                var totalInterval = intervalMinutes.minutesCreateToNow + intervalMinutes.minutesToShowTime;
                var valuePercentInterval = intervalMinutes.minutesToShowTime;
                var percentAux = Math.ceil(valuePercentInterval * 100 / totalInterval);
                expect(percentAux).toBe(widthBar);
            });

            it("If plan is EXECUTING and dueDate is mayor to currentDate" +
            "should be difference with startDate, currentDate, dueDate", function () {
                var currentDate = new Date(Date.now());
                widget.params.plan = {
                    currentState: widget.EXECUTING_PLAN,
                    startDate: 1427681470000, //2015/Mar/29
                    dueDate: 1438273470000
                };
                var intervalMinutes = {
                    minutesStartToNow: 60,
                    minutesToShowTime: 30
                }

                var widthBar = widget.getWidthBar(widget.params.plan, intervalMinutes);
                var totalInterval = intervalMinutes.minutesStartToNow + intervalMinutes.minutesToShowTime;
                var valuePercentInterval = intervalMinutes.minutesToShowTime;
                var percentAux = Math.ceil(valuePercentInterval * 100 / totalInterval);
                expect(percentAux).toBe(widthBar);
            });

            it("If plan is EXECUTING and dueDate is minor to currentDate" +
            "should be 0", function () {
                var currentDate = new Date(Date.now());
                widget.params.plan = {
                    currentState: widget.EXECUTING_PLAN,
                    dueDate: 1427681470000, //2015/Mar/29
                };
                var widthBar = widget.getWidthBar(widget.params.plan);
                expect(widthBar).toBe(0);

            });

            it("If plan is CLOSED and closedDate is mayor to currentDate" +
            "should be difference with startDate, currentDate, closedDate", function () {
                var currentDate = new Date(Date.now());
                widget.params.plan = {
                    currentState: widget.CLOSED_PLAN,
                    startDate: 1427681470000, //2015/Mar/29
                    closedDate: 1438273470000 //2015/Jul/30
                };
                var widthBar = widget.getWidthBar(widget.params.plan);
                var differenceStartDateToClosedDate = widget.params.plan.closedDate - widget.params.plan.startDate;
                var differenceStartDateToCurrentDate = currentDate.getTime() - widget.params.plan.startDate;
                var percentAux = Math.ceil(differenceStartDateToCurrentDate * 100 / differenceStartDateToClosedDate);
                expect(percentAux).toBe(widthBar);
            });

            it("if plan is CLOSED and closedDate is minor to currentDate" +
            "should be 100", function () {
                var currentDate = new Date(Date.now());
                widget.params.plan = {
                    currentState: widget.CLOSED_PLAN,
                    startDate: 1424681480000, //2015/Feb/23
                    closedDate: 1427681470000 //2015/Mar/29
                };
                var widthBar = widget.getWidthBar(widget.params.plan);
                expect(widthBar).toBe(100);
            });

        });
    });
    describe("UI", function () {
        describe("The general content", function () {
            beforeEach(function () {
                spyOn(Date, "now").and.returnValue(1432739680959); //2015/May/27
                spyOn(widget, "sub");
                spyOn(widget, "getIntervalOnMinutes").and.callFake(function () {
                    var defer = $.Deferred();
                    defer.resolve({minutesToShowTime: 100});
                    return defer.promise();
                });

                widget.params.plan = {
                    startDate: 1427681470000, //2015/Mar/29
                    currentState: widget.EXECUTING_PLAN,
                    dueDate: 1438273470000 //2015/Jul/30
                };

            });

            it("Should dont error when notify widget with a null plan", function () {
                widget.onNotifyLoadInfoSummaryPlan({}, {args: {}});
            });
            it("Should dont show nothing when notify widget with a plan dont have dueDate", function () {
                widget.params.plan = {
                    dueDate: null
                };

                widget.onNotifyLoadInfoSummaryPlan({}, {args: {}});

                expect($("div", widget.getContent()).length).toBe(0);
            });
            it("Should show anything when notify widget with a plan have dueDate and plan is PENDING or EXECUTING", function () {
                widget.params.plan = {
                    currentState: widget.PENDING_PLAN,
                    dueDate: 1438273470000 //2015/Jul/30
                };

                widget.onNotifyLoadInfoSummaryPlan({}, {args: {}});

                expect($("div", widget.getContent()).length).not.toBe(0);

                widget.params.plan = {
                    currentState: widget.EXECUTING_PLAN,
                    dueDate: 1438273470000 //2015/Jul/30
                };
                widget.onNotifyLoadInfoSummaryPlan({}, {args: {}});

                expect($("div", widget.getContent()).length).not.toBe(0);
            });
            it("Should wait notify LOADED_ACTIVITIES_PLAN when plan is CLOSED", function () {
                widget.params.plan = {
                    currentState: widget.CLOSED_PLAN,
                    dueDate: 1438273470000 //2015/Jul/30
                };
                widget.onNotifyLoadInfoSummaryPlan({}, {args: {}});

                expect(widget.sub).toHaveBeenCalledWith("LOADED_ACTIVITIES_PLAN", jasmine.any(Function));
            });
        });

        describe("The first date range", function () {
            it("Should be creationDate when plan is pending and hasnt defined dueDate", function () {
                widget.params.plan = {
                    creationDate: 1427681470000, //2015/Mar/29
                    currentState: widget.PENDING_PLAN
                };
                var response = widget.getFirstDate(widget.params.plan);
                expect(response).toBe(widget.params.plan.creationDate);
            });
            it("Should be dueDate when plan is pending and has defined dueDate", function () {
                widget.params.plan = {
                    dueDate: 1427681470000, //2015/Mar/29
                    currentState: widget.PENDING_PLAN
                };
                var response = widget.getFirstDate(widget.params.plan);
                expect(response).toBe(widget.params.plan.dueDate);
            });
            it("Should be startDate when plan is executing", function () {
                widget.params.plan = {
                    startDate: 1427681470000, //2015/Mar/29
                    currentState: widget.EXECUTING_PLAN
                };
                var response = widget.getFirstDate(widget.params.plan);
                expect(response).toBe(widget.params.plan.startDate);
            });
            it("Should be startDate when plan is closed", function () {
                widget.params.plan = {
                    startDate: 1427681470000, //2015/Mar/29
                    currentState: widget.CLOSED_PLAN
                };
                var response = widget.getFirstDate(widget.params.plan);
                expect(response).toBe(widget.params.plan.startDate);
            });
        });

        describe("The second date range", function () {
            it("should be null when plan is pending", function () {
                widget.params.plan = {
                    currentState: widget.PENDING_PLAN,
                    dueDate: 1427681470000 //2015/Mar/29
                };
                var response = widget.getSecondDate(widget.params.plan);
                expect(response).toBe(null);
            });

            it("Should be dueDate when plan is EXECUTING and dueDate is not null", function () {
                widget.params.plan = {
                    currentState: widget.EXECUTING_PLAN,
                    dueDate: 1427681470000 //2015/Mar/29
                };
                var response = widget.getSecondDate(widget.params.plan);
                expect(response).toBe(widget.params.plan.dueDate);
            });

            it("Should be null when plan is EXECUTING and dueDate is null", function () {
                widget.params.plan = {
                    currentState: widget.EXECUTING_PLAN,
                    dueDate: null
                };
                var response = widget.getSecondDate(widget.params.plan);
                expect(response).toBe(null);
            });

            it("Should be closedDate when plan is CLOSED", function () {
                widget.params.plan = {
                    currentState: widget.CLOSED_PLAN,
                    closedDate: 1427681470000 //2015/Mar/29
                };
                var response = widget.getSecondDate(widget.params.plan);
                expect(response).toBe(widget.params.plan.closedDate);
            });

        });
        describe("The cclor bar", function () {
            it("Should be red when the percent is minor to 33", function () {
                var colorBar = widget.getColorBarByPercent(32);
                expect(colorBar).toBe("Red");
            });
            it("Should be yellow when the percent is minor to 66 until 33", function () {
                var colorBar = widget.getColorBarByPercent(33);
                expect(colorBar).toBe("Yellow");

                var colorBar = widget.getColorBarByPercent(65);
                expect(colorBar).toBe("Yellow");
            });

            it("Should be Green when the percent is minor or equal to 100 until 66", function () {
                var colorBar = widget.getColorBarByPercent(100);
                expect(colorBar).toBe("Green");

                var colorBar = widget.getColorBarByPercent(66);
                expect(colorBar).toBe("Green");
            });
        });

    });
    describe("functions", function () {
        describe("callGetEffectiveDuration", function () {
            beforeEach(function () {
                spyOn(widget.dataService, "getEffectiveDuration");
            });
            it("Should call getEffectiveDuration", function () {
                widget.callGetEffectiveDuration();
                expect(widget.dataService.getEffectiveDuration).toHaveBeenCalled();
            });
        });

        describe("getDifferenceBetweenDates", function () {
            beforeEach(function () {
                spyOn(widget, "callGetEffectiveDuration").and.callFake(function () {
                    return {minutes: 100};
                });
            });
            it("Should call callGetEffectiveDuration", function () {
                bizagi.currentUser = bizagi.currentUser || {};
                bizagi.currentUser.idUser = 1;
                widget.getDifferenceBetweenDates(Date.now(), Date.now());
                expect(widget.callGetEffectiveDuration).toHaveBeenCalled();
            });
        });

        describe("getFormattedDate", function () {
            it("Should format date", function () {
                expect(widget.getFormattedDate(new Date(2016, 1, 1))).toBe("February 01 12:00 am");
                expect(widget.getFormattedDate(new Date(2016, 2, 1, 12, 12, 30))).toBe("March 01 12:12 pm");
                expect(widget.getFormattedDate(new Date(2020, 11, 1, 17, 18, 19))).toBe("December 01 05:18 pm");
            });
        });

    });
});
