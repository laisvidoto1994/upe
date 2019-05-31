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

public class USERSTARTPAGE : BaseEntity {


	public USERSTARTPAGE() {
	}

	public override int getIdEnt() {
		return 12;
	}

	public override Guid getGuidEnt() {
		return Guid.Parse("cdd02314-b635-4553-b2ab-7e6e77190a0e") ;
	}

	public override String getEntityName() {
		return  "USERSTARTPAGE";
	}
   public override String getClassName() {
      return "BizAgi.EntityManager.Entities.USERSTARTPAGE";
   }

	String surrogateKey = "idStartPage";

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

    static Dictionary<string, Func<USERSTARTPAGE, object>> gets = new Dictionary<string, Func<USERSTARTPAGE, object>>(StringComparer.OrdinalIgnoreCase)    {{ "id", new Func<USERSTARTPAGE, object>((USERSTARTPAGE be) => be.getId() ) }, { "guid", new Func<USERSTARTPAGE, object>((USERSTARTPAGE be) => be.GetGuid() ) },
        { "StartPageValue", new Func<USERSTARTPAGE, object>((USERSTARTPAGE be) => be.getStartPageValue() )         }    };

    static Dictionary<string, Action<USERSTARTPAGE,object>> sets = new Dictionary<string, Action<USERSTARTPAGE,object>>(StringComparer.OrdinalIgnoreCase)    {{ "id", new Action<USERSTARTPAGE,object>((USERSTARTPAGE be, object newValue ) => be.setId( Convert.ToInt64(newValue) ) ) }, { "guid", new Action<USERSTARTPAGE,object>((USERSTARTPAGE be, object newValue ) => be.SetGuid( (Guid)newValue) ) },
        { "StartPageValue", new Action<USERSTARTPAGE, object>((USERSTARTPAGE be, object newValue) => { if(newValue==null)be.setStartPageValue(null); else be.setStartPageValue((string) newValue ); })         }    };

    static Dictionary<string, string> _factToParentAttribute = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)    {
    };
	public String getDisplayAttrib() {
		return getStartPageValue() != null ? getStartPageValue().ToString() : null;
	}

	int? m_entityType = new int?(3);

	public override int? getEntityType()  {
		return m_entityType;
	}

	string m_startPageValue ;

	public string getStartPageValue() {
		return m_startPageValue;
	}

	public void setStartPageValue(string paramstartPageValue){
		this.m_startPageValue = paramstartPageValue;
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
		throw new Exception(string.Format("Error trying to set value for Attribute {0} in Entity {1}", propertyName, "USERSTARTPAGE")); 
	}
	public override string GetFactOwnerEntityName(string factName) {
		if(gets.ContainsKey(factName))  
		   return "USERSTARTPAGE";      
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

    USERSTARTPAGE tg = (USERSTARTPAGE) target; 
    cloneBaseValues(tg);
    tg.m_startPageValue = this.m_startPageValue; 

}

 
	}

}