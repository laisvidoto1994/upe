describe("bizagi.workportal.services.usersevents", function () {
    checkWorkportalDependencies();
    var UsersEventsService,
        dataService,
        loadTemplatesService,
        globalHandlersService,
        fakedataImages,
        fakedata,
        getUsersAndEvents,
        getUsersData;

    beforeEach(function(){

        fakedataImages = [
            {
                "picture": "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAeAB4DASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDH0jUBfOum3kokdSBbu3Y4+7n6461lXPhqbXJrzUpikFnFMYvNPJG0HoPqMZ96ZqJSKeK8iBB3gtg9cd8VY1nV59R0Vra2wsSxN8qKR82QzEHpz6fU0P3XdEwXZnFTFdKlYWtyQSwBcdeVIYcdhkirOlPExffqXkdcGOFnc/XHbp1qlqkCv5LxRyq7A7kK8YHAI9R1q3pPhy81BC9qG3AfM0iEJ9AfWm9NRpq1jso7VdUSHyCMzKUjHowx/wDXqroU0ttdfZbrBYMxjBxkNjDj/gS8VWtLye2vTuKkouUC8BSKNVkkHiOWdsFwwf6nGaabvdkPscy0rW1+A3G3I25yB616X4b0j+1tLSa4ufs9uo2oGYgM3U4GR61nSeEbXxFDb3qubaa5B3YJYZH1/Guz0TwZcXlmskl4NkeYokBYbVU4/OtoTu7GE5Kx/9k=",
                "id": 57,
                "name": "Marie Bell C"
            },
            {
                "picture": "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAeAB4DASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDvPirqN/a6dZWltuEN27JJ5edzHjC9cEHPTHavK7qxv7EbruxubcZxulhZVz9cV7V8Q7fz/DcboQs8F3DLEx6AhgDn2wTVl7jUGvxbfY0Nsy7mlJyuM4x16+2K4q6vM7qFTlgrHg0WbiVY4R5ju4jUKM/Megr1/wCF+pXs+nXumXh3f2fL5SfL90cgrnGDgg474PpitRYZLfU4oINItRbrmRJkRVCHofoxz2FN+H6KmiXT4/ez3s8znH3syMAR+C0UFaYV6nPDY6K/sYtRs5LaYAo4xyM4rNWRzbgbW8xflfbj5SOvWrt5eTQybY1TGOS2c5+lVBbmRReJIY5pG2ycZVuwOK6K9FuPOjjo1o8zgN84pbMzK2QMAtgbj+FaGmWMenWSQRgDA5wMD6AelUntiEa5klMkkLYjGMKrdM+/WrVpeSyyFZFQqBnK8HNKhRdudjrV4p8h/9k=",
                "id": 55,
                "name": "Adam Smith C"
            }
        ]

        fakedata = [
            {
                idCase: 4252,
                assignees: [{ "idUser": 55, "name": "Adam Smith C", "idTask": 47}],
                events: [],
                createdBy: { "idUser": 57,  "name": "Marie Bell C" }
            },
            {
                idCase: 4051,
                "assignees": [
                    { "idUser": 57, "name": "Marie Bell C", "idTask": 1061},
                    { "idUser": 57, "name": "Marie Bell C", "idTask": 1059}
                ],
                "events": [{ "idTask": 1061,  "displayName": "Evento 007", "idWorkitem": 4304 }],
                "createdBy": { "idUser": 57, "name": "Marie Bell C" }

            }
        ]

        dataService = bizagi.injector.get('dataService');
        loadTemplatesService = bizagi.injector.get('loadTemplatesService');
        globalHandlersService = bizagi.injector.get('globalHandlersService');
        getUsersAndEvents = sinon.stub(dataService, 'getUsersAndEvents');

        getUsersAndEvents
            .withArgs({ idCases: '4252, 4051'})
            .returns(fakedata);

        UsersEventsService = new  bizagi.workportal.services.usersevents(dataService, loadTemplatesService, globalHandlersService);

    });

    it('dependencies should defined', function(){

        expect(dataService).toBeDefined();
        expect(loadTemplatesService).toBeDefined();
        expect(dataService.getUsersAndEvents).toBeDefined();

    });

    it('Service should be defined', function(){
        expect(UsersEventsService).toBeDefined();
    });

    describe('Basic behaviour', function(){
        var loadData;
        beforeEach(function(){
            loadData = UsersEventsService.loadData({ idCases: '4252, 4051'});
        });

        it('Should load the data related', function(done){
            $.when(loadData)
                .done(function(data){
                    expect(data).toEqual(fakedata);
                    done();
                });
        });

        it('Should return the events of any case', function(done){
            $.when(loadData)
                .done(function(){
                    var events = UsersEventsService.getEvents(4051);
                    var event = events[0];

                    expect(events.length).toEqual(1);
                    expect(event.idTask).toEqual(1061);
                    done();
                });
        });
    });


    describe('Assignees', function () {
        var loadData,
            $promise,
            $template,
            getUserImage;

        beforeEach(function () {
            loadData = UsersEventsService.loadData({ idCases: '4252, 4051' });
            getUsersData = sinon.stub(dataService, 'getUsersData');
            getUserImage = getUsersData
                .withArgs({ userIds: '55,57',
                    width: 30,
                    height: 30,
                    square: true})
                .returns(fakedataImages);
        });

        it('Should have a reference to assignes available for each case', function (done) {
            $.when(loadData)
                .done(function () {
                    $promise = UsersEventsService.getAssignees(4051);
                    UsersEventsService.getAssignees(4252);

                    $promise.done( function(result){
                        expect( $promise.state() ).toBe( 'resolved' );

                    });
                    expect(dataService.getUsersData).toBeDefined();
                    done();
                });
        });

        afterEach(function(){
            dataService.getUsersData.restore();
        })
    });

    afterEach(function(){
        dataService.getUsersAndEvents.restore();
    })


});
