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

public class App : BaseEntity {


	public App() {
	}

	public override int getIdEnt() {
		return 10000;
	}

	public override Guid getGuidEnt() {
		return Guid.Parse("ec064a1b-3ce3-4f66-b398-83d1aebc8119") ;
	}

	public override String getEntityName() {
		return  "App";
	}
   public override String getClassName() {
      return "BizAgi.EntityManager.Entities.App";
   }

	String surrogateKey = "idCase";

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

    static Dictionary<string, Func<App, object>> gets = new Dictionary<string, Func<App, object>>(StringComparer.OrdinalIgnoreCase)    {{ "id", new Func<App, object>((App be) => be.getId() ) }, { "idcase", new Func<App, object>((App be) => be.getIdCase() ) },
        { "ProcessoVender", new Func<App, object>((App be) => be.getProcessoVender() )         }    };

    static Dictionary<string, Action<App,object>> sets = new Dictionary<string, Action<App,object>>(StringComparer.OrdinalIgnoreCase)    {{ "id", new Action<App,object>((App be, object newValue ) => be.setId( Convert.ToInt64(newValue) ) ) }, { "idcase", new Action<App, object>((App be, object newValue) => be.setIdCase((int)newValue) ) },
        { "ProcessoVender", new Action<App, object>((App be, object newValue) => { if(newValue==null)be.setProcessoVender(null); else be.setProcessoVender((ProcessoVender) newValue ); })         }    };

    static Dictionary<string, string> _factToParentAttribute = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)    {
    };
	int? m_idCase ;

	public int? getIdCase() {
		return m_idCase;
	}

	public void setIdCase(int? paramidCase){
		this.m_idCase = paramidCase;
	}

	public String getDisplayAttrib() {
		return null;
	}

	int? m_entityType = new int?(0);

	public override int? getEntityType()  {
		return m_entityType;
	}

	ProcessoVender m_ProcessoVender ;

	public ProcessoVender getProcessoVender() {
        if ((!this.isPersisting()) && (m_ProcessoVender != null) && (m_ProcessoVender.isLoaded() ) ) { 
            m_ProcessoVender = (ProcessoVender)getPersistenceManager().find(m_ProcessoVender.getClassName(), m_ProcessoVender.getId());
        } else if ((!this.isPersisting()) && (m_ProcessoVender != null)) { 
            m_ProcessoVender = (ProcessoVender)ApplyScopeChangesToEntity(m_ProcessoVender);
        }
		return m_ProcessoVender;
	}

	public void setProcessoVender(ProcessoVender paramProcessoVender){
		this.m_ProcessoVender = paramProcessoVender;
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
		throw new Exception(string.Format("Error trying to set value for Attribute {0} in Entity {1}", propertyName, "App")); 
	}
	public override string GetFactOwnerEntityName(string factName) {
		if(gets.ContainsKey(factName))  
		   return "App";      
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

    App tg = (App) target; 
    cloneBaseValues(tg);
    tg.m_ProcessoVender = (ProcessoVender)cloneRelation(this.m_ProcessoVender); 

}

 
	}

}