namespace BizAgi.EntityManager.Entities {

using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Text;
using Vision.Defs.OracleSpecific;
using BizAgi.PAL;
using BizAgi.PAL.Util;
using BizAgi.PAL.BeanUtils;
using BizAgi.EntityManager.Persistence;
using BizAgi.PAL.historylog;
using BizAgi.Resources;

public class LOCATION : BaseEntity {


	public LOCATION() {
	}

	public override int getIdEnt() {
		return 2;
	}

	public override Guid getGuidEnt() {
		return Guid.Parse("d20f5e67-2e44-4fc7-b248-bf8d6daa07fc") ;
	}

	public override String getEntityName() {
		return  "LOCATION";
	}
   public override String getClassName() {
      return "BizAgi.EntityManager.Entities.LOCATION";
   }

	String surrogateKey = "idLocation";

	public override String getSurrogateKey() {
		return surrogateKey;
	}

	public override bool isVirtualEntity() {
		return false;
	}

	public override Dictionary<string, object> getVirtualBusinessKey() {
		return new Dictionary<string, object>() {  };
	}

	public override bool canCreateNewInstances() {
		return true;
	}

    static Dictionary<string, Func<LOCATION, object>> gets = new Dictionary<string, Func<LOCATION, object>>(StringComparer.OrdinalIgnoreCase)    {{ "id", new Func<LOCATION, object>((LOCATION be) => be.getId() ) }, { "guid", new Func<LOCATION, object>((LOCATION be) => be.GetGuid() ) },
        { "LocName", new Func<LOCATION, object>((LOCATION be) => be.getLocName() )         },
        { "IdParentLocation", new Func<LOCATION, object>((LOCATION be) => be.getIdParentLocation() )         },
        { "LocDisplayName", new Func<LOCATION, object>((LOCATION be) => be.getLocDisplayName() )         },
        { "LocDescription", new Func<LOCATION, object>((LOCATION be) => be.getLocDescription() )         },
        { "CostLocation", new Func<LOCATION, object>((LOCATION be) => be.getCostLocation() )         },
        { "IdWorkingTimeSchema", new Func<LOCATION, object>((LOCATION be) => be.getIdWorkingTimeSchema() )         },
        { "IdTimeZone", new Func<LOCATION, object>((LOCATION be) => be.getIdTimeZone() )         },
        { "IdOrg", new Func<LOCATION, object>((LOCATION be) => be.getIdOrg() )         }    };

    static Dictionary<string, Action<LOCATION,object>> sets = new Dictionary<string, Action<LOCATION,object>>(StringComparer.OrdinalIgnoreCase)    {{ "id", new Action<LOCATION,object>((LOCATION be, object newValue ) => be.setId( Convert.ToInt64(newValue) ) ) }, { "guid", new Action<LOCATION,object>((LOCATION be, object newValue ) => be.SetGuid( (Guid)newValue) ) },
        { "LocName", new Action<LOCATION, object>((LOCATION be, object newValue) => { if(newValue==null)be.setLocName(null); else be.setLocName((string) newValue ); })         },
        { "IdParentLocation", new Action<LOCATION, object>((LOCATION be, object newValue) => { if(newValue==null)be.setIdParentLocation(null); else be.setIdParentLocation((LOCATION) newValue ); })         },
        { "LocDisplayName", new Action<LOCATION, object>((LOCATION be, object newValue) => { if(newValue==null)be.setLocDisplayName(null); else be.setLocDisplayName((string) newValue ); })         },
        { "LocDescription", new Action<LOCATION, object>((LOCATION be, object newValue) => { if(newValue==null)be.setLocDescription(null); else be.setLocDescription((string) newValue ); })         },
        { "CostLocation", new Action<LOCATION, object>((LOCATION be, object newValue) => { if(newValue==null)be.setCostLocation(null); else be.setCostLocation(Convert.ToDouble(newValue)); })         },
        { "IdWorkingTimeSchema", new Action<LOCATION, object>((LOCATION be, object newValue) => { if(newValue==null)be.setIdWorkingTimeSchema(null); else be.setIdWorkingTimeSchema((WORKINGTIMESCHEMA) newValue ); })         },
        { "IdTimeZone", new Action<LOCATION, object>((LOCATION be, object newValue) => { if(newValue==null)be.setIdTimeZone(null); else be.setIdTimeZone((BATIMEZONE) newValue ); })         },
        { "IdOrg", new Action<LOCATION, object>((LOCATION be, object newValue) => { if(newValue==null)be.setIdOrg(null); else be.setIdOrg((ORG) newValue ); })         }    };

    static Dictionary<string, string> _factToParentAttribute = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)    {
    };
	public String getDisplayAttrib() {
		return getLocDisplayName() != null ? getLocDisplayName().ToString() : null;
	}

	int? m_entityType = new int?(3);

	public override int? getEntityType()  {
		return m_entityType;
	}

	string m_locName ;

	public string getLocName() {
		return m_locName;
	}

	public void setLocName(string paramlocName){
		this.m_locName = paramlocName;
	}

	LOCATION m_idParentLocation ;

	public LOCATION getIdParentLocation() {
		if ((!this.isPersisting()) && (m_idParentLocation != null) ) { 
			m_idParentLocation = (LOCATION)getPersistenceManager().find(m_idParentLocation.getClassName(), m_idParentLocation.getId());
		}
		return m_idParentLocation;
	}

	public void setIdParentLocation(LOCATION paramidParentLocation){
		this.m_idParentLocation = paramidParentLocation;
	}

	string m_locDisplayName ;

	public string getLocDisplayName() {
		return m_locDisplayName;
	}

	public void setLocDisplayName(string paramlocDisplayName){
		this.m_locDisplayName = paramlocDisplayName;
	}

	string m_locDescription ;

	public string getLocDescription() {
		return m_locDescription;
	}

	public void setLocDescription(string paramlocDescription){
		this.m_locDescription = paramlocDescription;
	}

	double? m_costLocation ;

	public double? getCostLocation() {
		return m_costLocation;
	}

	public void setCostLocation(double? paramcostLocation){
		this.m_costLocation = paramcostLocation;
	}

	WORKINGTIMESCHEMA m_idWorkingTimeSchema ;

	public WORKINGTIMESCHEMA getIdWorkingTimeSchema() {
		if ((!this.isPersisting()) && (m_idWorkingTimeSchema != null) ) { 
			m_idWorkingTimeSchema = (WORKINGTIMESCHEMA)getPersistenceManager().find(m_idWorkingTimeSchema.getClassName(), m_idWorkingTimeSchema.getId());
		}
		return m_idWorkingTimeSchema;
	}

	public void setIdWorkingTimeSchema(WORKINGTIMESCHEMA paramidWorkingTimeSchema){
		this.m_idWorkingTimeSchema = paramidWorkingTimeSchema;
	}

	BATIMEZONE m_idTimeZone ;

	public BATIMEZONE getIdTimeZone() {
		if ((!this.isPersisting()) && (m_idTimeZone != null) ) { 
			m_idTimeZone = (BATIMEZONE)getPersistenceManager().find(m_idTimeZone.getClassName(), m_idTimeZone.getId());
		}
		return m_idTimeZone;
	}

	public void setIdTimeZone(BATIMEZONE paramidTimeZone){
		this.m_idTimeZone = paramidTimeZone;
	}

	ORG m_idOrg ;

	public ORG getIdOrg() {
		if ((!this.isPersisting()) && (m_idOrg != null) ) { 
			m_idOrg = (ORG)getPersistenceManager().find(m_idOrg.getClassName(), m_idOrg.getId());
		}
		return m_idOrg;
	}

	public void setIdOrg(ORG paramidOrg){
		this.m_idOrg = paramidOrg;
	}

   public override object getXPath(PropertyTokenizer xPathTokenizer) {
       String completeXPath = xPathTokenizer.getCurrentPath();
               return BizAgi.PAL.XPath.XPathUtil.evaluateXPath(this, completeXPath);
   }

    public override IBaseEntity addRelationWithId(String path, long id, bool createBackRelationScopeAction, bool createHistoryLogActions, bool isAttach = true) {
        try {
        BaseEntity ret = null;
        String attrRelated = null;
        bool bIsMxMFact = false;
  if(!gets.ContainsKey(path)){ return base.addRelationWithId(path, id, createBackRelationScopeAction, createHistoryLogActions, isAttach ); }  
 

        if (ret == null) {
            throw new BABeanUtilsException("Path not found. Path:" + path);
        } else {
            ret.setHistoryLog(getHistoryLog());
            ret.setPersistenceManager(getPersistenceManager());
            if (!bIsMxMFact) {
				if (createBackRelationScopeAction) {
					ret.setXPath(attrRelated, this);
				} else {
					PropertyUtils.setProperty(ret, attrRelated, this);
				}
            }
            return ret;
        }
        } catch (Exception e) {
           throw new BABeanUtilsException(e);
        }
    }

	public override IBaseEntity addRelation(String path, long id) {
		BaseEntity ret = (BaseEntity)addRelationWithId(path, id, true, true);
         ScopeAction action;
       if (getEntityType().Value == 0) {// PV Entity
           action = ScopeActionFactory.getAddRelationAction(ret.getId(), path);
       } else {
           action = ScopeActionFactory.getAddRelationEntityAction(this.getClassName(), this.getId(), ret.getId(), path);
       }
       getHistoryLog().add(action);
       return ret;
	}

	public override String toXML()  {
		StringBuilder xml = new StringBuilder();
		return xml.ToString();
	}
	public override Object getLocalizedValue(String attributeName) {
		Object attributeValue = this.getXPath(attributeName);		
		if (attributeName.Equals("locDisplayName")){
           int iBizagiTable = 0;
           CLanguageManager lgManager = new CLanguageManager();
           iBizagiTable = lgManager.GetBizAgiTableId(this.getEntityName());
           if(iBizagiTable > 0)
		        return getResourceMetadataValue((BizAgi.Defs.eMetadataType) iBizagiTable, "locDisplayName", (String)attributeValue);
		}

		return attributeValue;
	}
	public override bool containsAttribute(string propertyName) {
		return gets.ContainsKey(propertyName); 
	}
	protected override Object GetPropertyValueByName(string propertyName) {
		if(gets.ContainsKey(propertyName)) 
		    return gets[propertyName].Invoke(this); 
		else if (this.GetType().BaseType != typeof(BaseEntity)) 
		    return base.GetPropertyValueByName(propertyName); 
		throw new Exception("Attribute not found"); 
	}
	public override void SetPropertyValue(string propertyName, object newValue) {
	    if(newValue == DBNull.Value) 
	        newValue = null; 
	    if(sets.ContainsKey(propertyName)){ 
	        sets[propertyName].Invoke(this, newValue); 
	        return; 
		}else if (this.GetType().BaseType != typeof(BaseEntity)){ 
	        base.SetPropertyValue(propertyName, newValue); return;  }
		throw new Exception(string.Format("Error trying to set value for Attribute {0} in Entity {1}", propertyName, "LOCATION")); 
	}
	public override string GetFactOwnerEntityName(string factName) {
		if(gets.ContainsKey(factName))  
		   return "LOCATION";      
		else if (this.GetType().BaseType != typeof(BaseEntity))  
		   return base.GetFactOwnerEntityName(factName);      
		throw new Exception("Fact entity not found for '"+ factName + "' "); 
	}
	public override string GetFactOwnerAttribute(string factKey) {
		return _factToParentAttribute[factKey]; 
	}
	public override bool ExistsFactOwnerAttribute(string factKey) {
		return _factToParentAttribute.ContainsKey(factKey); 
	}
	protected override void  cloneValues(object target, Hashtable reentrance){

    LOCATION tg = (LOCATION) target; 
    cloneBaseValues(tg);
    tg.m_locName = this.m_locName; 
    tg.m_idParentLocation = (LOCATION)cloneRelation(this.m_idParentLocation); 
    tg.m_locDisplayName = this.m_locDisplayName; 
    tg.m_locDescription = this.m_locDescription; 
    tg.m_costLocation = this.m_costLocation; 
    tg.m_idWorkingTimeSchema = (WORKINGTIMESCHEMA)cloneRelation(this.m_idWorkingTimeSchema); 
    tg.m_idTimeZone = (BATIMEZONE)cloneRelation(this.m_idTimeZone); 
    tg.m_idOrg = (ORG)cloneRelation(this.m_idOrg); 

}

 
	}

}