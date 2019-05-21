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

public class BATIMEZONE : BaseEntity {


	public BATIMEZONE() {
	}

	public override int getIdEnt() {
		return 10;
	}

	public override Guid getGuidEnt() {
		return Guid.Parse("1c1a30c1-9141-42cc-ad53-c22cd7b22c62") ;
	}

	public override String getEntityName() {
		return  "BATIMEZONE";
	}
   public override String getClassName() {
      return "BizAgi.EntityManager.Entities.BATIMEZONE";
   }

	String surrogateKey = "idBATimeZone";

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

    static Dictionary<string, Func<BATIMEZONE, object>> gets = new Dictionary<string, Func<BATIMEZONE, object>>(StringComparer.OrdinalIgnoreCase)    {{ "id", new Func<BATIMEZONE, object>((BATIMEZONE be) => be.getId() ) }, { "guid", new Func<BATIMEZONE, object>((BATIMEZONE be) => be.GetGuid() ) },
        { "TzName", new Func<BATIMEZONE, object>((BATIMEZONE be) => be.getTzName() )         },
        { "TzDisplayName", new Func<BATIMEZONE, object>((BATIMEZONE be) => be.getTzDisplayName() )         }    };

    static Dictionary<string, Action<BATIMEZONE,object>> sets = new Dictionary<string, Action<BATIMEZONE,object>>(StringComparer.OrdinalIgnoreCase)    {{ "id", new Action<BATIMEZONE,object>((BATIMEZONE be, object newValue ) => be.setId( Convert.ToInt64(newValue) ) ) }, { "guid", new Action<BATIMEZONE,object>((BATIMEZONE be, object newValue ) => be.SetGuid( (Guid)newValue) ) },
        { "TzName", new Action<BATIMEZONE, object>((BATIMEZONE be, object newValue) => { if(newValue==null)be.setTzName(null); else be.setTzName((string) newValue ); })         },
        { "TzDisplayName", new Action<BATIMEZONE, object>((BATIMEZONE be, object newValue) => { if(newValue==null)be.setTzDisplayName(null); else be.setTzDisplayName((string) newValue ); })         }    };

    static Dictionary<string, string> _factToParentAttribute = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)    {
    };
	public String getDisplayAttrib() {
		return getTzDisplayName() != null ? getTzDisplayName().ToString() : null;
	}

	int? m_entityType = new int?(3);

	public override int? getEntityType()  {
		return m_entityType;
	}

	string m_tzName ;

	public string getTzName() {
		return m_tzName;
	}

	public void setTzName(string paramtzName){
		this.m_tzName = paramtzName;
	}

	string m_tzDisplayName ;

	public string getTzDisplayName() {
		return m_tzDisplayName;
	}

	public void setTzDisplayName(string paramtzDisplayName){
		this.m_tzDisplayName = paramtzDisplayName;
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
		if (attributeName.Equals("tzDisplayName")){
           int iBizagiTable = 0;
           CLanguageManager lgManager = new CLanguageManager();
           iBizagiTable = lgManager.GetBizAgiTableId(this.getEntityName());
           if(iBizagiTable > 0)
		        return getResourceMetadataValue((BizAgi.Defs.eMetadataType) iBizagiTable, "tzDisplayName", (String)attributeValue);
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
		throw new Exception(string.Format("Error trying to set value for Attribute {0} in Entity {1}", propertyName, "BATIMEZONE")); 
	}
	public override string GetFactOwnerEntityName(string factName) {
		if(gets.ContainsKey(factName))  
		   return "BATIMEZONE";      
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

    BATIMEZONE tg = (BATIMEZONE) target; 
    cloneBaseValues(tg);
    tg.m_tzName = this.m_tzName; 
    tg.m_tzDisplayName = this.m_tzDisplayName; 

}

 
	}

}