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

public class LANGUAGE : BaseEntity {


	public LANGUAGE() {
	}

	public override int getIdEnt() {
		return 11;
	}

	public override Guid getGuidEnt() {
		return Guid.Parse("d4921485-c35b-44d0-ad14-70d8fd216a4a") ;
	}

	public override String getEntityName() {
		return  "LANGUAGE";
	}
   public override String getClassName() {
      return "BizAgi.EntityManager.Entities.LANGUAGE";
   }

	String surrogateKey = "idLGLanguage";

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

    static Dictionary<string, Func<LANGUAGE, object>> gets = new Dictionary<string, Func<LANGUAGE, object>>(StringComparer.OrdinalIgnoreCase)    {{ "id", new Func<LANGUAGE, object>((LANGUAGE be) => be.getId() ) }, { "guid", new Func<LANGUAGE, object>((LANGUAGE be) => be.GetGuid() ) },
        { "Language", new Func<LANGUAGE, object>((LANGUAGE be) => be.getLanguage() )         },
        { "CultureName", new Func<LANGUAGE, object>((LANGUAGE be) => be.getCultureName() )         },
        { "Country", new Func<LANGUAGE, object>((LANGUAGE be) => be.getCountry() )         },
        { "State", new Func<LANGUAGE, object>((LANGUAGE be) => be.getState() )         },
        { "CultureDisplayName", new Func<LANGUAGE, object>((LANGUAGE be) => be.getCultureDisplayName() )         }    };

    static Dictionary<string, Action<LANGUAGE,object>> sets = new Dictionary<string, Action<LANGUAGE,object>>(StringComparer.OrdinalIgnoreCase)    {{ "id", new Action<LANGUAGE,object>((LANGUAGE be, object newValue ) => be.setId( Convert.ToInt64(newValue) ) ) }, { "guid", new Action<LANGUAGE,object>((LANGUAGE be, object newValue ) => be.SetGuid( (Guid)newValue) ) },
        { "Language", new Action<LANGUAGE, object>((LANGUAGE be, object newValue) => { if(newValue==null)be.setLanguage(null); else be.setLanguage((string) newValue ); })         },
        { "CultureName", new Action<LANGUAGE, object>((LANGUAGE be, object newValue) => { if(newValue==null)be.setCultureName(null); else be.setCultureName((string) newValue ); })         },
        { "Country", new Action<LANGUAGE, object>((LANGUAGE be, object newValue) => { if(newValue==null)be.setCountry(null); else be.setCountry((string) newValue ); })         },
        { "State", new Action<LANGUAGE, object>((LANGUAGE be, object newValue) => { if(newValue==null)be.setState(null); else be.setState(Convert.ToBoolean(newValue)); })         },
        { "CultureDisplayName", new Action<LANGUAGE, object>((LANGUAGE be, object newValue) => { if(newValue==null)be.setCultureDisplayName(null); else be.setCultureDisplayName((string) newValue ); })         }    };

    static Dictionary<string, string> _factToParentAttribute = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)    {
    };
	public String getDisplayAttrib() {
		return getCultureDisplayName() != null ? getCultureDisplayName().ToString() : null;
	}

	int? m_entityType = new int?(3);

	public override int? getEntityType()  {
		return m_entityType;
	}

	string m_language ;

	public string getLanguage() {
		return m_language;
	}

	public void setLanguage(string paramlanguage){
		this.m_language = paramlanguage;
	}

	string m_CultureName ;

	public string getCultureName() {
		return m_CultureName;
	}

	public void setCultureName(string paramCultureName){
		this.m_CultureName = paramCultureName;
	}

	string m_Country ;

	public string getCountry() {
		return m_Country;
	}

	public void setCountry(string paramCountry){
		this.m_Country = paramCountry;
	}

	bool? m_State ;

	public bool? getState() {
		return m_State;
	}

	public void setState(bool? paramState){
		this.m_State = paramState;
	}

	string m_CultureDisplayName ;

	public string getCultureDisplayName() {
		return m_CultureDisplayName;
	}

	public void setCultureDisplayName(string paramCultureDisplayName){
		this.m_CultureDisplayName = paramCultureDisplayName;
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
		throw new Exception(string.Format("Error trying to set value for Attribute {0} in Entity {1}", propertyName, "LANGUAGE")); 
	}
	public override string GetFactOwnerEntityName(string factName) {
		if(gets.ContainsKey(factName))  
		   return "LANGUAGE";      
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

    LANGUAGE tg = (LANGUAGE) target; 
    cloneBaseValues(tg);
    tg.m_language = this.m_language; 
    tg.m_CultureName = this.m_CultureName; 
    tg.m_Country = this.m_Country; 
    tg.m_State = this.m_State; 
    tg.m_CultureDisplayName = this.m_CultureDisplayName; 

}

 
	}

}