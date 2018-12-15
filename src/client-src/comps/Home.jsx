import React from 'react'
import Paper from "@material-ui/core/Paper"
import List from "@material-ui/core/List"
import Button from "@material-ui/core/Button"
import withStyles from '@material-ui/core/styles/withStyles'

import PluginItem from './PluginItem.jsx'
import BrowseItem from './BrowseItem.jsx'

import CSinterface from '../../libs/CSInterface';
// Get a reference to a CSInterface object
const csInterface = new CSInterface();

const eventSet = 1936028772; // "setd" 
// Get extension ID
const gExtensionID = csInterface.getExtensionID();
var gRegisteredEvents = [eventSet];
function PhotoshopCallbackUnique(csEvent) {
    try {
        if (typeof csEvent.data === "string") {
            var eventData = csEvent.data.replace("ver1,{", "{");
            var eventDataParse = JSON.parse(eventData);
            var jsonStringBack = JSON.stringify(eventDataParse);
            cosole.log("PhotoshopCallbackUnique: " + jsonStringBack);

            var uiItemToUpdate = null;
            if (eventDataParse.eventID === eventMake)
                uiItemToUpdate = lblMake;
            else if (eventDataParse.eventID === eventDelete)
                uiItemToUpdate = lblDelete;
            else if (eventDataParse.eventID === eventClose)
                uiItemToUpdate = lblClose;
            else if (eventDataParse.eventID === eventSelect)
                uiItemToUpdate = lblSelect;
            else if (eventDataParse.eventID === eventSet)
                uiItemToUpdate = lblSet;

            if (uiItemToUpdate !== null) {
                var count = Number(uiItemToUpdate.innerHTML) + 1;
                uiItemToUpdate.innerHTML = " " + count;
            }
            console.log(csEvent);
            
            // if you just made a text layer, let me check my object for something
            // interesting to dump to log
            if (eventDataParse &&
                eventDataParse.eventData.null &&
                eventDataParse.eventData.null._ref &&
                eventDataParse.eventData.null._ref === "textLayer") {
                cosole.log("Got a text layer, trying to find paragraphStyleRange");
                if (eventDataParse.eventData.using &&
                    eventDataParse.eventData.using.paragraphStyleRange) {
                    cosole.log("paragraphStyleRange:" + eventDataParse.eventData.using.paragraphStyleRange);
                    cosole.log("paragraphStyleRange typeof :" + typeof eventDataParse.eventData.using.paragraphStyleRange);
                    cosole.log("paragraphStyleRange[0].from: " + eventDataParse.eventData.using.paragraphStyleRange[0].from);
                }
            }
        } else {
            cosole.log("PhotoshopCallbackUnique expecting string for csEvent.data!");
        }
    } catch (e) {
        cosole.log("PhotoshopCallbackUnique catch:" + e);
    }
}
    // Tell Photoshop to not unload us when closed
    function Persistent(inOn) {
        var event;
        if (inOn) {
            event = new CSEvent("com.adobe.PhotoshopPersistent", "APPLICATION");
        } else {
            event = new CSEvent("com.adobe.PhotoshopUnPersistent", "APPLICATION");
        }
        event.extensionId = gExtensionID;
        csInterface.dispatchEvent(event);
    }

    // Tell Photoshop the events we want to listen for
    function Register(inOn, inEvents) {
        var event;
        if (inOn) {
            event = new CSEvent("com.adobe.PhotoshopRegisterEvent", "APPLICATION");
        } else {
            event = new CSEvent("com.adobe.PhotoshopUnRegisterEvent", "APPLICATION");
        }
        console.log(inEvents);
        
        event.extensionId = gExtensionID;
        event.data = inEvents;
        csInterface.dispatchEvent(event);
    }
const styles = theme => ({
    root: {
        paddingTop:theme.spacing.unit * 1
    },
    paper: {
        display:'flex',
        flexDirection: 'column'
    },
    export: {
        margin: theme.spacing.unit * 3,
        alignSelf: 'flex-end'
    }
})

/**
 * Home tab content
 *
 */
class Home extends React.Component {

    constructor() {
        super()

        this.textureItemRef = React.createRef()
        this.masksItemRef = React.createRef()
        this.infoItemRef = React.createRef()
        this.flattenItemRef = React.createRef()
        this.browseItemRef = React.createRef()
    }

    componentWillMount() {
        Persistent(true);
        console.log('ddd');
        
        Register(true, gRegisteredEvents.toString());
    }
    /**
     * export button was clicked
     *
     */
    export_onClick = (e) => {
        var folderPath = this.browseItemRef.current.path
        var isTexturesChecked = this.textureItemRef.current.isChecked
        var isMasksChecked = this.masksItemRef.current.isChecked
        var isInfoChecked = this.infoItemRef.current.isChecked
        var isFlattenChecked = this.flattenItemRef.current.isChecked

        var { onExecutePlugin } = this.props

        onExecutePlugin({
            folderPath,
            isTexturesChecked,
            isMasksChecked,
            isInfoChecked,
            isFlattenChecked
        })
        if(isTexturesChecked) {
            location.reload();
        }
    }

    render() {
        const { classes } = this.props;
        const cs = new CSInterface();
        // console.log(cs.getCurren  / /tApiVersion())
        // cs.evalScript('todo()')
        return (
            <div className={classes.root}>
                <Paper elevation={5} className={classes.paper}>
                    <List>
                        <PluginItem ref={this.textureItemRef} index='0' title='Textures'
                                    desc='export textures' icon='texture'/>
                        <PluginItem ref={this.masksItemRef} index='1' title='Masks'
                                    desc='export masks' icon='layers'/>
                        <PluginItem ref={this.infoItemRef} index='2' title='Info'
                                    desc='export info json' icon='info'/>
                        <PluginItem ref={this.flattenItemRef} index='3' title='Flatten'
                                    desc='flatten display list' icon='list'/>
                        <BrowseItem innerRef={this.browseItemRef}/>
                    </List>
                    <Button onClick={this.export_onClick}
                            className={classes.export} size="small">
                        Exfddfff
                    </Button>
                </Paper>

            </div>
        )

    }

}

export default withStyles(styles)(Home);
