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

public class SKILL : BaseEntity {


	public SKILL() {
	}

	public override int getIdEnt() {
		return 5;
	}

	public override Guid getGuidEnt() {
		return Guid.Parse("0d76e352-63a8-46a3-b948-56e5ca2e7cf6") ;
	}

	public override String getEntityName() {
		return  "SKILL";
	}
   public override String getClassName() {
      return "BizAgi.EntityManager.Entities.SKILL";
   }

	String surrogateKey = "idSkill";

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

    static Dictionary<string, Func<SKILL, object>> gets = new Dictionary<string, Func<SKILL, object>>(StringComparer.OrdinalIgnoreCase)    {{ "id", new Func<SKILL, object>((SKILL be) => be.getId() ) }, { "guid", new Func<SKILL, object>((SKILL be) => be.GetGuid() ) },
        { "SkillName", new Func<SKILL, object>((SKILL be) => be.getSkillName() )         },
        { "SkillDisplayName", new Func<SKILL, object>((SKILL be) => be.getSkillDisplayName() )         },
        { "SkillDescription", new Func<SKILL, object>((SKILL be) => be.getSkillDescription() )         }    };

    static Dictionary<string, Action<SKILL,object>> sets = new Dictionary<string, Action<SKILL,object>>(StringComparer.OrdinalIgnoreCase)    {{ "id", new Action<SKILL,object>((SKILL be, object newValue ) => be.setId( Convert.ToInt64(newValue) ) ) }, { "guid", new Action<SKILL,object>((SKILL be, object newValue ) => be.SetGuid( (Guid)newValue) ) },
        { "SkillName", new Action<SKILL, object>((SKILL be, object newValue) => { if(newValue==null)be.setSkillName(null); else be.setSkillName((string) newValue ); })         },
        { "SkillDisplayName", new Action<SKILL, object>((SKILL be, object newValue) => { if(newValue==null)be.setSkillDisplayName(null); else be.setSkillDisplayName((string) newValue ); })         },
        { "SkillDescription", new Action<SKILL, object>((SKILL be, object newValue) => { if(newValue==null)be.setSkillDescription(null); else be.setSkillDescription((string) newValue ); })         }    };

    static Dictionary<string, string> _factToParentAttribute = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)    {
    };
	public String getDisplayAttrib() {
		return getSkillDisplayName() != null ? getSkillDisplayName().ToString() : null;
	}

	int? m_entityType = new int?(3);

	public override int? getEntityType()  {
		return m_entityType;
	}

	string m_skillName ;

	public string getSkillName() {
		return m_skillName;
	}

	public void setSkillName(string paramskillName){
		this.m_skillName = paramskillName;
	}

	string m_skillDisplayName ;

	public string getSkillDisplayName() {
		return m_skillDisplayName;
	}

	public void setSkillDisplayName(string paramskillDisplayName){
		this.m_skillDisplayName = paramskillDisplayName;
	}

	string m_skillDescription ;

	public string getSkillDescription() {
		return m_skillDescription;
	}

	public void setSkillDescription(string paramskillDescription){
		this.m_skillDescription = paramskillDescription;
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
		if (attributeName.Equals("skillDisplayName")){
           int iBizagiTable = 0;
           CLanguageManager lgManager = new CLanguageManager();
           iBizagiTable = lgManager.GetBizAgiTableId(this.getEntityName());
           if(iBizagiTable > 0)
		        return getResourceMetadataValue((BizAgi.Defs.eMetadataType) iBizagiTable, "skillDisplayName", (String)attributeValue);
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
		throw new Exception(string.Format("Error trying to set value for Attribute {0} in Entity {1}", propertyName, "SKILL")); 
	}
	public override string GetFactOwnerEntityName(string factName) {
		if(gets.ContainsKey(factName))  
		   return "SKILL";      
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

    SKILL tg = (SKILL) target; 
    cloneBaseValues(tg);
    tg.m_skillName = this.m_skillName; 
    tg.m_skillDisplayName = this.m_skillDisplayName; 
    tg.m_skillDescription = this.m_skillDescription; 

}

 
	}

}