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

public class WORKINGTIMESCHEMA : BaseEntity {


	public WORKINGTIMESCHEMA() {
	}

	public override int getIdEnt() {
		return 7;
	}

	public override Guid getGuidEnt() {
		return Guid.Parse("8d1d1348-10a7-4043-b3d0-3276d59199ed") ;
	}

	public override String getEntityName() {
		return  "WORKINGTIMESCHEMA";
	}
   public override String getClassName() {
      return "BizAgi.EntityManager.Entities.WORKINGTIMESCHEMA";
   }

	String surrogateKey = "idWorkingTimeSchema";

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

    static Dictionary<string, Func<WORKINGTIMESCHEMA, object>> gets = new Dictionary<string, Func<WORKINGTIMESCHEMA, object>>(StringComparer.OrdinalIgnoreCase)    {{ "id", new Func<WORKINGTIMESCHEMA, object>((WORKINGTIMESCHEMA be) => be.getId() ) }, { "guid", new Func<WORKINGTIMESCHEMA, object>((WORKINGTIMESCHEMA be) => be.GetGuid() ) },
        { "WtsName", new Func<WORKINGTIMESCHEMA, object>((WORKINGTIMESCHEMA be) => be.getWtsName() )         }    };

    static Dictionary<string, Action<WORKINGTIMESCHEMA,object>> sets = new Dictionary<string, Action<WORKINGTIMESCHEMA,object>>(StringComparer.OrdinalIgnoreCase)    {{ "id", new Action<WORKINGTIMESCHEMA,object>((WORKINGTIMESCHEMA be, object newValue ) => be.setId( Convert.ToInt64(newValue) ) ) }, { "guid", new Action<WORKINGTIMESCHEMA,object>((WORKINGTIMESCHEMA be, object newValue ) => be.SetGuid( (Guid)newValue) ) },
        { "WtsName", new Action<WORKINGTIMESCHEMA, object>((WORKINGTIMESCHEMA be, object newValue) => { if(newValue==null)be.setWtsName(null); else be.setWtsName((string) newValue ); })         }    };

    static Dictionary<string, string> _factToParentAttribute = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)    {
    };
	public String getDisplayAttrib() {
		return getWtsName() != null ? getWtsName().ToString() : null;
	}

	int? m_entityType = new int?(3);

	public override int? getEntityType()  {
		return m_entityType;
	}

	string m_wtsName ;

	public string getWtsName() {
		return m_wtsName;
	}

	public void setWtsName(string paramwtsName){
		this.m_wtsName = paramwtsName;
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
		throw new Exception(string.Format("Error trying to set value for Attribute {0} in Entity {1}", propertyName, "WORKINGTIMESCHEMA")); 
	}
	public override string GetFactOwnerEntityName(string factName) {
		if(gets.ContainsKey(factName))  
		   return "WORKINGTIMESCHEMA";      
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

    WORKINGTIMESCHEMA tg = (WORKINGTIMESCHEMA) target; 
    cloneBaseValues(tg);
    tg.m_wtsName = this.m_wtsName; 

}

 
	}

}