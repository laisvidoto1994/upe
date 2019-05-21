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

public class ORG : BaseEntity {


	public ORG() {
	}

	public override int getIdEnt() {
		return 9;
	}

	public override Guid getGuidEnt() {
		return Guid.Parse("977a30ae-914f-42cc-a453-bf26d7b72c69") ;
	}

	public override String getEntityName() {
		return  "ORG";
	}
   public override String getClassName() {
      return "BizAgi.EntityManager.Entities.ORG";
   }

	String surrogateKey = "idOrg";

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

    static Dictionary<string, Func<ORG, object>> gets = new Dictionary<string, Func<ORG, object>>(StringComparer.OrdinalIgnoreCase)    {{ "id", new Func<ORG, object>((ORG be) => be.getId() ) }, { "guid", new Func<ORG, object>((ORG be) => be.GetGuid() ) },
        { "OrgName", new Func<ORG, object>((ORG be) => be.getOrgName() )         },
        { "OrgCreationDate", new Func<ORG, object>((ORG be) => be.getOrgCreationDate() )         },
        { "IdHolidaySchema", new Func<ORG, object>((ORG be) => be.getIdHolidaySchema() )         },
        { "IdWorkingTimeSchema", new Func<ORG, object>((ORG be) => be.getIdWorkingTimeSchema() )         },
        { "IdTimeZone", new Func<ORG, object>((ORG be) => be.getIdTimeZone() )         }    };

    static Dictionary<string, Action<ORG,object>> sets = new Dictionary<string, Action<ORG,object>>(StringComparer.OrdinalIgnoreCase)    {{ "id", new Action<ORG,object>((ORG be, object newValue ) => be.setId( Convert.ToInt64(newValue) ) ) }, { "guid", new Action<ORG,object>((ORG be, object newValue ) => be.SetGuid( (Guid)newValue) ) },
        { "OrgName", new Action<ORG, object>((ORG be, object newValue) => { if(newValue==null)be.setOrgName(null); else be.setOrgName((string) newValue ); })         },
        { "OrgCreationDate", new Action<ORG, object>((ORG be, object newValue) => { if(newValue==null)be.setOrgCreationDate(null); else be.setOrgCreationDate(Convert.ToDateTime(newValue)); })         },
        { "IdHolidaySchema", new Action<ORG, object>((ORG be, object newValue) => { if(newValue==null)be.setIdHolidaySchema(null); else be.setIdHolidaySchema(Convert.ToInt32(newValue)); })         },
        { "IdWorkingTimeSchema", new Action<ORG, object>((ORG be, object newValue) => { if(newValue==null)be.setIdWorkingTimeSchema(null); else be.setIdWorkingTimeSchema((WORKINGTIMESCHEMA) newValue ); })         },
        { "IdTimeZone", new Action<ORG, object>((ORG be, object newValue) => { if(newValue==null)be.setIdTimeZone(null); else be.setIdTimeZone((BATIMEZONE) newValue ); })         }    };

    static Dictionary<string, string> _factToParentAttribute = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)    {
    };
	public String getDisplayAttrib() {
		return getOrgName() != null ? getOrgName().ToString() : null;
	}

	int? m_entityType = new int?(3);

	public override int? getEntityType()  {
		return m_entityType;
	}

	string m_orgName ;

	public string getOrgName() {
		return m_orgName;
	}

	public void setOrgName(string paramorgName){
		this.m_orgName = paramorgName;
	}

	DateTime? m_orgCreationDate ;

	public DateTime? getOrgCreationDate() {
		return m_orgCreationDate;
	}

	public void setOrgCreationDate(DateTime? paramorgCreationDate){
		this.m_orgCreationDate = paramorgCreationDate;
	}

	int? m_idHolidaySchema ;

	public int? getIdHolidaySchema() {
		return m_idHolidaySchema;
	}

	public void setIdHolidaySchema(int? paramidHolidaySchema){
		this.m_idHolidaySchema = paramidHolidaySchema;
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
		throw new Exception(string.Format("Error trying to set value for Attribute {0} in Entity {1}", propertyName, "ORG")); 
	}
	public override string GetFactOwnerEntityName(string factName) {
		if(gets.ContainsKey(factName))  
		   return "ORG";      
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

    ORG tg = (ORG) target; 
    cloneBaseValues(tg);
    tg.m_orgName = this.m_orgName; 
    tg.m_orgCreationDate = this.m_orgCreationDate; 
    tg.m_idHolidaySchema = this.m_idHolidaySchema; 
    tg.m_idWorkingTimeSchema = (WORKINGTIMESCHEMA)cloneRelation(this.m_idWorkingTimeSchema); 
    tg.m_idTimeZone = (BATIMEZONE)cloneRelation(this.m_idTimeZone); 

}

 
	}

}