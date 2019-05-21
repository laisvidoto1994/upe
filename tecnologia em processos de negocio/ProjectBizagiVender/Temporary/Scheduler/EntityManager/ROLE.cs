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

public class ROLE : BaseEntity {


	public ROLE() {
	}

	public override int getIdEnt() {
		return 4;
	}

	public override Guid getGuidEnt() {
		return Guid.Parse("3bc34803-2a0e-40d8-b94b-a43b4531be98") ;
	}

	public override String getEntityName() {
		return  "ROLE";
	}
   public override String getClassName() {
      return "BizAgi.EntityManager.Entities.ROLE";
   }

	String surrogateKey = "idRole";

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

    static Dictionary<string, Func<ROLE, object>> gets = new Dictionary<string, Func<ROLE, object>>(StringComparer.OrdinalIgnoreCase)    {{ "id", new Func<ROLE, object>((ROLE be) => be.getId() ) }, { "guid", new Func<ROLE, object>((ROLE be) => be.GetGuid() ) },
        { "RoleName", new Func<ROLE, object>((ROLE be) => be.getRoleName() )         },
        { "RoleDisplayName", new Func<ROLE, object>((ROLE be) => be.getRoleDisplayName() )         },
        { "RoleDescription", new Func<ROLE, object>((ROLE be) => be.getRoleDescription() )         }    };

    static Dictionary<string, Action<ROLE,object>> sets = new Dictionary<string, Action<ROLE,object>>(StringComparer.OrdinalIgnoreCase)    {{ "id", new Action<ROLE,object>((ROLE be, object newValue ) => be.setId( Convert.ToInt64(newValue) ) ) }, { "guid", new Action<ROLE,object>((ROLE be, object newValue ) => be.SetGuid( (Guid)newValue) ) },
        { "RoleName", new Action<ROLE, object>((ROLE be, object newValue) => { if(newValue==null)be.setRoleName(null); else be.setRoleName((string) newValue ); })         },
        { "RoleDisplayName", new Action<ROLE, object>((ROLE be, object newValue) => { if(newValue==null)be.setRoleDisplayName(null); else be.setRoleDisplayName((string) newValue ); })         },
        { "RoleDescription", new Action<ROLE, object>((ROLE be, object newValue) => { if(newValue==null)be.setRoleDescription(null); else be.setRoleDescription((string) newValue ); })         }    };

    static Dictionary<string, string> _factToParentAttribute = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)    {
    };
	public String getDisplayAttrib() {
		return getRoleDisplayName() != null ? getRoleDisplayName().ToString() : null;
	}

	int? m_entityType = new int?(3);

	public override int? getEntityType()  {
		return m_entityType;
	}

	string m_roleName ;

	public string getRoleName() {
		return m_roleName;
	}

	public void setRoleName(string paramroleName){
		this.m_roleName = paramroleName;
	}

	string m_roleDisplayName ;

	public string getRoleDisplayName() {
		return m_roleDisplayName;
	}

	public void setRoleDisplayName(string paramroleDisplayName){
		this.m_roleDisplayName = paramroleDisplayName;
	}

	string m_roleDescription ;

	public string getRoleDescription() {
		return m_roleDescription;
	}

	public void setRoleDescription(string paramroleDescription){
		this.m_roleDescription = paramroleDescription;
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
		if (attributeName.Equals("roleDisplayName")){
           int iBizagiTable = 0;
           CLanguageManager lgManager = new CLanguageManager();
           iBizagiTable = lgManager.GetBizAgiTableId(this.getEntityName());
           if(iBizagiTable > 0)
		        return getResourceMetadataValue((BizAgi.Defs.eMetadataType) iBizagiTable, "roleDisplayName", (String)attributeValue);
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
		throw new Exception(string.Format("Error trying to set value for Attribute {0} in Entity {1}", propertyName, "ROLE")); 
	}
	public override string GetFactOwnerEntityName(string factName) {
		if(gets.ContainsKey(factName))  
		   return "ROLE";      
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

    ROLE tg = (ROLE) target; 
    cloneBaseValues(tg);
    tg.m_roleName = this.m_roleName; 
    tg.m_roleDisplayName = this.m_roleDisplayName; 
    tg.m_roleDescription = this.m_roleDescription; 

}

 
	}

}