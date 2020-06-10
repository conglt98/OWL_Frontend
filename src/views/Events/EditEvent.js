import React, {Component} from 'react';
// import eventsData from './EventsData'
import PageTitle from './PageTitle'
import ViewEvent from './ViewEvent/ViewEvent'
import {getOneEvent,getEventDomains,getProfileEvents,getEventClients} from '../../api/event'
import {getOneDomain} from '../../api/domain'
import {getOneProfile} from '../../api/profile'
import {getTiers} from '../../api/tier'
import {getRules} from '../../api/rule'
import {getConditions} from '../../api/condition'
import fakeAuth from '../../api/fakeAuth'
import uuid from 'react-uuid'
export default class EditEvent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      event:{},
    }
  }

  componentWillMount = async () => {
    let result = {}
    let event = await getOneEvent(fakeAuth.getAccessToken(),this.props.match.params.id);
    if (event && event.data){
      result = event.data
    }

    let clients = await getEventClients(fakeAuth.getAccessToken(),0,1000);
    let clientsFiltered = clients.data?clients.data.list:[];
    clientsFiltered = clientsFiltered.filter(ele=>ele.eventId.toString()===this.props.match.params.id.toString());
    result.client = clientsFiltered;

    let eventDomains = await getEventDomains(fakeAuth.getAccessToken(),0,1000);
    let eventDomainsFiltered = eventDomains.data?eventDomains.data.list:[]
    eventDomainsFiltered = eventDomainsFiltered.filter(ele => ele.eventId.toString() === this.props.match.params.id.toString());

    let listDomains = []
    for (let i=0;i<eventDomainsFiltered.length;i++){
      let domain = await getOneDomain(fakeAuth.getAccessToken(),eventDomainsFiltered[i].domainId);
      let profileEvents = await getProfileEvents(fakeAuth.getAccessToken(),0,1000);
      let profileEventsFilter = profileEvents.data.list.filter(ele => ele.eventDomainId === eventDomainsFiltered[i].id)

      let listProfiles = []
      for (let j=0;j<profileEventsFilter.length;j++){
        let profile = await getOneProfile(fakeAuth.getAccessToken(),profileEventsFilter[j].profileId);
        let conditions = [];
        conditions = await getConditions(fakeAuth.getAccessToken(),0,1000);

        let tiers = await getTiers(fakeAuth.getAccessToken(),0,1000);
        let tiersFiltered = tiers.data?tiers.data.list:[]
        tiersFiltered = tiersFiltered.filter(ele=>ele.profileId.toString() === profile.data.id.toString());

        for (let k=0;k<tiersFiltered.length;k++){
          let rules = await getRules(fakeAuth.getAccessToken(),0,1000);

          let rulesFiltered = [];
          if (rules.data.list){
            rulesFiltered = rules.data.list.filter(ele=>ele.tierId.toString()===tiersFiltered[k].id.toString())
          }

          rulesFiltered.map(ele=>{
            console.log(ele)
            let conditionFilterRuleVersion = conditions.data.list.filter(con=>(con.conditionType.toString()==='rule'&&String(con.conditionTypeId)===String(ele.latestVersion.id)))
            ele.ruleConditions = conditionFilterRuleVersion;
            ele.filter = ele.filter?ele.filter:'None'
            ele.ruleConditions.map(con=>{
              con.operation = 'compare'
            })
          })
          tiersFiltered[k].listRules = rulesFiltered;
        }

        tiersFiltered.map(ele=>{
          let conditionFilterTier = conditions.data.list.filter(con=>(con.conditionType.toString()==='tier'&&con.conditionTypeId.toString()===ele.id.toString()))
          ele.conditions = conditionFilterTier;
          ele.conditions.map(con=>{
            con.operation = 'compare'
          })
        })

        profile.data.listTiers = tiersFiltered;
        let conditionFilterProfile = conditions.data.list.filter(ele=>(ele.conditionType.toString()==='profile'&&ele.conditionTypeId.toString()===profile.data.id.toString()))
        conditionFilterProfile.map(ele=>{ele.operation='compare'})
        profile.data.conditions = conditionFilterProfile;
        profile.data.filter = profile.data.filter?profile.data.filter:'None'
        listProfiles.push(profile.data)
      }
      domain.data.id = domain.data&&domain.data.id?domain.data.id:"ERROR$"+eventDomainsFiltered[i].domainId
      domain.data.name = domain.data&&domain.data.name?domain.data.name:"ERROR$"+eventDomainsFiltered[i].domainId

      let dataDefinitions = []
      domain.data.dataDefinitions.map(ele=>{
        let defs =ele.defs.substring(1,ele.defs.length-1);
        defs = defs.replaceAll("{","")
        defs = defs.replaceAll("}","")
        let dataDefs = []
        let allField = defs.split(",");
        for (let i= 0;i<allField.length - 1;i=i+2){
          let name = allField[i].split(":")[1];
          let type = allField[i+1].split(":")[1];
          name = name.replaceAll("\ ","")
          name = name.replaceAll("\"","")
          type = type.replaceAll("\ ","")
          type = type.replaceAll("\"","")
          dataDefs.push({name:name,type:type})
        }
        console.log(dataDefs)
        let item = {
          id:ele.id,
          createAt:ele.createAt,
          name:ele.name,
          source:ele.source,
          defs:JSON.stringify(dataDefs),
          accumulationKeys:ele.accumulationKeys
        }
        dataDefinitions.push(item)
      })
      let dataTemp = {
        id:domain.data.id,
        createAt:domain.data.createAt,
        name:domain.data.name,
        description:domain.data.description,
        sourceId:domain.data.sourceId,
        status:eventDomainsFiltered[i].status,
        dataDefinitions:dataDefinitions,
        listProfiles:listProfiles
      }
      listDomains.push(dataTemp);
    }
    result.data = listDomains;
    sessionStorage.setItem("event",JSON.stringify(result))
    this.setState({
      event:result
    })
  }

  render() {
    const event = this.state.event;
    const heading = `Edit event ID: ${this.props.match.params.id}`;
    return (
      <div className="animated fadeIn">
        <PageTitle
            heading= {heading}
            subheading="This page changes detail information of an event"
            icon="fa fa-edit icon-gradient bg-mean-fruit"
            mode="edit"
        />
        <ViewEvent mode="edit" event ={event}></ViewEvent>
      </div>
    )
  }
}
