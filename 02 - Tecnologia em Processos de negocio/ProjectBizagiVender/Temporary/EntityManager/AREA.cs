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

public class AREA : BaseEntity {


	public AREA() {
	}

	public override int getIdEnt() {
		return 3;
	}

	public override Guid getGuidEnt() {
		return Guid.Parse("49f928b3-9df4-423d-aded-1fdb994a030e") ;
	}

	public override String getEntityName() {
		return  "AREA";
	}
   public override String getClassName() {
      return "BizAgi.EntityManager.Entities.AREA";
   }

	String surrogateKey = "idArea";

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

    static Dictionary<string, Func<AREA, object>> gets = new Dictionary<string, Func<AREA, object>>(StringComparer.OrdinalIgnoreCase)    {{ "id", new Func<AREA, object>((AREA be) => be.getId() ) }, { "guid", new Func<AREA, object>((AREA be) => be.GetGuid() ) },
        { "AreaName", new Func<AREA, object>((AREA be) => be.getAreaName() )         },
        { "AreaDisplayName", new Func<AREA, object>((AREA be) => be.getAreaDisplayName() )         },
        { "AreaDescription", new Func<AREA, object>((AREA be) => be.getAreaDescription() )         },
        { "CostArea", new Func<AREA, object>((AREA be) => be.getCostArea() )         }    };

    static Dictionary<string, Action<AREA,object>> sets = new Dictionary<string, Action<AREA,object>>(StringComparer.OrdinalIgnoreCase)    {{ "id", new Action<AREA,object>((AREA be, object newValue ) => be.setId( Convert.ToInt64(newValue) ) ) }, { "guid", new Action<AREA,object>((AREA be, object newValue ) => be.SetGuid( (Guid)newValue) ) },
        { "AreaName", new Action<AREA, object>((AREA be, object newValue) => { if(newValue==null)be.setAreaName(null); else be.setAreaName((string) newValue ); })         },
        { "AreaDisplayName", new Action<AREA, object>((AREA be, object newValue) => { if(newValue==null)be.setAreaDisplayName(null); else be.setAreaDisplayName((string) newValue ); })         },
        { "AreaDescription", new Action<AREA, object>((AREA be, object newValue) => { if(newValue==null)be.setAreaDescription(null); else be.setAreaDescription((string) newValue ); })         },
        { "CostArea", new Action<AREA, object>((AREA be, object newValue) => { if(newValue==null)be.setCostArea(null); else be.setCostArea(Convert.ToDouble(newValue)); })         }    };

    static Dictionary<string, string> _factToParentAttribute = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)    {
    };
	public String getDisplayAttrib() {
		return getAreaDisplayName() != null ? getAreaDisplayName().ToString() : null;
	}

	int? m_entityType = new int?(3);

	public override int? getEntityType()  {
		return m_entityType;
	}

	string m_areaName ;

	public string getAreaName() {
		return m_areaName;
	}

	public void setAreaName(string paramareaName){
		this.m_areaName = paramareaName;
	}

	string m_areaDisplayName ;

	public string getAreaDisplayName() {
		return m_areaDisplayName;
	}

	public void setAreaDisplayName(string paramareaDisplayName){
		this.m_areaDisplayName = paramareaDisplayName;
	}

	string m_areaDescription ;

	public string getAreaDescription() {
		return m_areaDescription;
	}

	public void setAreaDescription(string paramareaDescription){
		this.m_areaDescription = paramareaDescription;
	}

	double? m_costArea ;

	public double? getCostArea() {
		return m_costArea;
	}

	public void setCostArea(double? paramcostArea){
		this.m_costArea = paramcostArea;
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
		if (attributeName.Equals("areaDisplayName")){
           int iBizagiTable = 0;
           CLanguageManager lgManager = new CLanguageManager();
           iBizagiTable = lgManager.GetBizAgiTableId(this.getEntityName());
           if(iBizagiTable > 0)
		        return getResourceMetadataValue((BizAgi.Defs.eMetadataType) iBizagiTable, "areaDisplayName", (String)attributeValue);
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
		throw new Exception(string.Format("Error trying to set value for Attribute {0} in Entity {1}", propertyName, "AREA")); 
	}
	public override string GetFactOwnerEntityName(string factName) {
		if(gets.ContainsKey(factName))  
		   return "AREA";      
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

    AREA tg = (AREA) target; 
    cloneBaseValues(tg);
    tg.m_areaName = this.m_areaName; 
    tg.m_areaDisplayName = this.m_areaDisplayName; 
    tg.m_areaDescription = this.m_areaDescription; 
    tg.m_costArea = this.m_costArea; 

}

 
	}

}