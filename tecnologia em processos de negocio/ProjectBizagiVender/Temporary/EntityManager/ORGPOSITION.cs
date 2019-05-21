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

public class ORGPOSITION : BaseEntity {


	public ORGPOSITION() {
	}

	public override int getIdEnt() {
		return 6;
	}

	public override Guid getGuidEnt() {
		return Guid.Parse("a83814f3-c530-4906-86cb-e0ea8f083ea2") ;
	}

	public override String getEntityName() {
		return  "ORGPOSITION";
	}
   public override String getClassName() {
      return "BizAgi.EntityManager.Entities.ORGPOSITION";
   }

	String surrogateKey = "idPosition";

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

    static Dictionary<string, Func<ORGPOSITION, object>> gets = new Dictionary<string, Func<ORGPOSITION, object>>(StringComparer.OrdinalIgnoreCase)    {{ "id", new Func<ORGPOSITION, object>((ORGPOSITION be) => be.getId() ) }, { "guid", new Func<ORGPOSITION, object>((ORGPOSITION be) => be.GetGuid() ) },
        { "PosName", new Func<ORGPOSITION, object>((ORGPOSITION be) => be.getPosName() )         },
        { "IdParentPosition", new Func<ORGPOSITION, object>((ORGPOSITION be) => be.getIdParentPosition() )         },
        { "PosDisplayName", new Func<ORGPOSITION, object>((ORGPOSITION be) => be.getPosDisplayName() )         },
        { "PosDescription", new Func<ORGPOSITION, object>((ORGPOSITION be) => be.getPosDescription() )         },
        { "CostPosition", new Func<ORGPOSITION, object>((ORGPOSITION be) => be.getCostPosition() )         },
        { "IdOrg", new Func<ORGPOSITION, object>((ORGPOSITION be) => be.getIdOrg() )         }    };

    static Dictionary<string, Action<ORGPOSITION,object>> sets = new Dictionary<string, Action<ORGPOSITION,object>>(StringComparer.OrdinalIgnoreCase)    {{ "id", new Action<ORGPOSITION,object>((ORGPOSITION be, object newValue ) => be.setId( Convert.ToInt64(newValue) ) ) }, { "guid", new Action<ORGPOSITION,object>((ORGPOSITION be, object newValue ) => be.SetGuid( (Guid)newValue) ) },
        { "PosName", new Action<ORGPOSITION, object>((ORGPOSITION be, object newValue) => { if(newValue==null)be.setPosName(null); else be.setPosName((string) newValue ); })         },
        { "IdParentPosition", new Action<ORGPOSITION, object>((ORGPOSITION be, object newValue) => { if(newValue==null)be.setIdParentPosition(null); else be.setIdParentPosition((ORGPOSITION) newValue ); })         },
        { "PosDisplayName", new Action<ORGPOSITION, object>((ORGPOSITION be, object newValue) => { if(newValue==null)be.setPosDisplayName(null); else be.setPosDisplayName((string) newValue ); })         },
        { "PosDescription", new Action<ORGPOSITION, object>((ORGPOSITION be, object newValue) => { if(newValue==null)be.setPosDescription(null); else be.setPosDescription((string) newValue ); })         },
        { "CostPosition", new Action<ORGPOSITION, object>((ORGPOSITION be, object newValue) => { if(newValue==null)be.setCostPosition(null); else be.setCostPosition(Convert.ToDouble(newValue)); })         },
        { "IdOrg", new Action<ORGPOSITION, object>((ORGPOSITION be, object newValue) => { if(newValue==null)be.setIdOrg(null); else be.setIdOrg((ORG) newValue ); })         }    };

    static Dictionary<string, string> _factToParentAttribute = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)    {
    };
	public String getDisplayAttrib() {
		return getPosDisplayName() != null ? getPosDisplayName().ToString() : null;
	}

	int? m_entityType = new int?(3);

	public override int? getEntityType()  {
		return m_entityType;
	}

	string m_posName ;

	public string getPosName() {
		return m_posName;
	}

	public void setPosName(string paramposName){
		this.m_posName = paramposName;
	}

	ORGPOSITION m_idParentPosition ;

	public ORGPOSITION getIdParentPosition() {
		if ((!this.isPersisting()) && (m_idParentPosition != null) ) { 
			m_idParentPosition = (ORGPOSITION)getPersistenceManager().find(m_idParentPosition.getClassName(), m_idParentPosition.getId());
		}
		return m_idParentPosition;
	}

	public void setIdParentPosition(ORGPOSITION paramidParentPosition){
		this.m_idParentPosition = paramidParentPosition;
	}

	string m_posDisplayName ;

	public string getPosDisplayName() {
		return m_posDisplayName;
	}

	public void setPosDisplayName(string paramposDisplayName){
		this.m_posDisplayName = paramposDisplayName;
	}

	string m_posDescription ;

	public string getPosDescription() {
		return m_posDescription;
	}

	public void setPosDescription(string paramposDescription){
		this.m_posDescription = paramposDescription;
	}

	double? m_costPosition ;

	public double? getCostPosition() {
		return m_costPosition;
	}

	public void setCostPosition(double? paramcostPosition){
		this.m_costPosition = paramcostPosition;
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
		if (attributeName.Equals("posDisplayName")){
           int iBizagiTable = 0;
           CLanguageManager lgManager = new CLanguageManager();
           iBizagiTable = lgManager.GetBizAgiTableId(this.getEntityName());
           if(iBizagiTable > 0)
		        return getResourceMetadataValue((BizAgi.Defs.eMetadataType) iBizagiTable, "posDisplayName", (String)attributeValue);
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
		throw new Exception(string.Format("Error trying to set value for Attribute {0} in Entity {1}", propertyName, "ORGPOSITION")); 
	}
	public override string GetFactOwnerEntityName(string factName) {
		if(gets.ContainsKey(factName))  
		   return "ORGPOSITION";      
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

    ORGPOSITION tg = (ORGPOSITION) target; 
    cloneBaseValues(tg);
    tg.m_posName = this.m_posName; 
    tg.m_idParentPosition = (ORGPOSITION)cloneRelation(this.m_idParentPosition); 
    tg.m_posDisplayName = this.m_posDisplayName; 
    tg.m_posDescription = this.m_posDescription; 
    tg.m_costPosition = this.m_costPosition; 
    tg.m_idOrg = (ORG)cloneRelation(this.m_idOrg); 

}

 
	}

}