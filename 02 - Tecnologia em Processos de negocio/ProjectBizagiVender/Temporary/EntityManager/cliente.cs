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

public class cliente : BaseEntity {


	public cliente() {
	}

	public override int getIdEnt() {
		return 10002;
	}

	public override Guid getGuidEnt() {
		return Guid.Parse("4c1275ad-7b8b-4bd6-a379-3ed3b3216dac") ;
	}

	public override String getEntityName() {
		return  "cliente";
	}
   public override String getClassName() {
      return "BizAgi.EntityManager.Entities.cliente";
   }

	String surrogateKey = "idcliente";

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

    static Dictionary<string, Func<cliente, object>> gets = new Dictionary<string, Func<cliente, object>>(StringComparer.OrdinalIgnoreCase)    {{ "id", new Func<cliente, object>((cliente be) => be.getId() ) },
        { "Nome", new Func<cliente, object>((cliente be) => be.getNome() )         },
        { "IdProcessoVender", new Func<cliente, object>((cliente be) => be.getIdProcessoVender() )         }    };

    static Dictionary<string, Action<cliente,object>> sets = new Dictionary<string, Action<cliente,object>>(StringComparer.OrdinalIgnoreCase)    {{ "id", new Action<cliente,object>((cliente be, object newValue ) => be.setId( Convert.ToInt64(newValue) ) ) },
        { "Nome", new Action<cliente, object>((cliente be, object newValue) => { if(newValue==null)be.setNome(null); else be.setNome((string) newValue ); })         },
        { "IdProcessoVender", new Action<cliente, object>((cliente be, object newValue) => { if(newValue==null)be.setIdProcessoVender(null); else be.setIdProcessoVender((ProcessoVender) newValue ); })         }    };

    static Dictionary<string, string> _factToParentAttribute = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)    {
    };
	public String getDisplayAttrib() {
		return null;
	}

	int? m_entityType = new int?(1);

	public override int? getEntityType()  {
		return m_entityType;
	}

	string m_nome ;

	public string getNome() {
		return m_nome;
	}

	public void setNome(string paramnome){
		this.m_nome = paramnome;
	}

	ProcessoVender m_idProcessoVender ;

	public ProcessoVender getIdProcessoVender() {
        if ((!this.isPersisting()) && (m_idProcessoVender != null) && (m_idProcessoVender.isLoaded() ) ) { 
            m_idProcessoVender = (ProcessoVender)getPersistenceManager().find(m_idProcessoVender.getClassName(), m_idProcessoVender.getId());
        } else if ((!this.isPersisting()) && (m_idProcessoVender != null)) { 
            m_idProcessoVender = (ProcessoVender)ApplyScopeChangesToEntity(m_idProcessoVender);
        }
		return m_idProcessoVender;
	}

	public void setIdProcessoVender(ProcessoVender paramidProcessoVender){
		this.m_idProcessoVender = paramidProcessoVender;
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
		throw new Exception(string.Format("Error trying to set value for Attribute {0} in Entity {1}", propertyName, "cliente")); 
	}
	public override string GetFactOwnerEntityName(string factName) {
		if(gets.ContainsKey(factName))  
		   return "cliente";      
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

    cliente tg = (cliente) target; 
    cloneBaseValues(tg);
    tg.m_nome = this.m_nome; 
    tg.m_idProcessoVender = (ProcessoVender)cloneRelation(this.m_idProcessoVender); 

}

 
	}

}