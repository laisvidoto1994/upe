if(!$.bizagi){
    $.bizagi = {processviewer:{}};
}

$.bizagi.processviewer = {
    "configuration": {
        "constants":{
            "ELEMENT_TYPE":{
                "PROCESS":"Process",
                "LANE":"Lane",
                "MILESTONES":"Milestone",
                "TEXTANNOTATION":"TextAnnotation",
                "ASSOCIATION":"Association",
                "SEQUENCEFLOW":"SequenceFlow"
            },
            "CONDITION_TYPE":{
                "SUBPROCESSEXP": "SubprocessException",
                "CANCELLATION": "Cancellation",
                "NORMAL": "Normal",
                "RELATION": "Relation",
                "COMPENSATION": "Compensation"
            },
            "PROPERTIES":{
                    "WAYPOINTS":"waypoints",
                    "BOUNDS":"bounds"
            },
            "LANESETS":"laneSets",
            "LANES":"lanes",
            "BPMNLABELSTYLES":"bpmnLabelStyles",
        },
        "validTypeDefinitions": [
                "artifacts",
                "flowElements",
                "laneSets",
                "milestones"
            ]
    },
    "design": {
        "markers":{
            "normal":{
                "type":"path",
                "properties":{
                    "d":"M0.616,9.401  l2.05-4.4l-2.05-4.399l8.8,4.433L0.616,9.401",
                    "class":"normal"
                }
            },
            "highlighted":{
                "type":"path",
                "properties":{
                    "d":"M0.616,9.401  l2.05-4.4l-2.05-4.399l8.8,4.433L0.616,9.401",
                    "class":"highlighted"
                }
            },
            "selected":{
                "type":"path",
                "properties":{
                    "d":"M0.616,9.401  l2.05-4.4l-2.05-4.399l8.8,4.433L0.616,9.401",
                    "class":"highlighted"
                }
            },
            "association":{
                "type":"path",
                "properties":{
                    "d":"M0.595,0.598  l8.8,4.132l-8.8,4.667",
                    "class":"association"
                }
            }
        }
    }
};