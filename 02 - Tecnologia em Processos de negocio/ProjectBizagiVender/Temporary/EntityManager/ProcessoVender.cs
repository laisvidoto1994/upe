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

public class ProcessoVender : BaseEntity {


	public ProcessoVender() {
	}

	public override int getIdEnt() {
		return 10001;
	}

	public override Guid getGuidEnt() {
		return Guid.Parse("e047468d-6542-480d-ade0-cee08e8d995b") ;
	}

	public override String getEntityName() {
		return  "ProcessoVender";
	}
   public override String getClassName() {
      return "BizAgi.EntityManager.Entities.ProcessoVender";
   }

	String surrogateKey = "idProcessoVender";

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

    static Dictionary<string, Func<ProcessoVender, object>> gets = new Dictionary<string, Func<ProcessoVender, object>>(StringComparer.OrdinalIgnoreCase)    {{ "id", new Func<ProcessoVender, object>((ProcessoVender be) => be.getId() ) },
        { "CodPedido", new Func<ProcessoVender, object>((ProcessoVender be) => be.getCodPedido() )         },
        { "NomeCliente", new Func<ProcessoVender, object>((ProcessoVender be) => be.getNomeCliente() )         },
        { "CodCliente", new Func<ProcessoVender, object>((ProcessoVender be) => be.getCodCliente() )         },
        { "CodProduto", new Func<ProcessoVender, object>((ProcessoVender be) => be.getCodProduto() )         },
        { "NomeProduto", new Func<ProcessoVender, object>((ProcessoVender be) => be.getNomeProduto() )         },
        { "QuantidadeProduto", new Func<ProcessoVender, object>((ProcessoVender be) => be.getQuantidadeProduto() )         },
        { "ValorProduto", new Func<ProcessoVender, object>((ProcessoVender be) => be.getValorProduto() )         },
        { "ValorTotalPedido", new Func<ProcessoVender, object>((ProcessoVender be) => be.getValorTotalPedido() )         },
        { "Idcliente", new Func<ProcessoVender, object>((ProcessoVender be) => be.getIdcliente() )         }, 
    // FACTS 

    };

    static Dictionary<string, Action<ProcessoVender,object>> sets = new Dictionary<string, Action<ProcessoVender,object>>(StringComparer.OrdinalIgnoreCase)    {{ "id", new Action<ProcessoVender,object>((ProcessoVender be, object newValue ) => be.setId( Convert.ToInt64(newValue) ) ) },
        { "CodPedido", new Action<ProcessoVender, object>((ProcessoVender be, object newValue) => { if(newValue==null)be.setCodPedido(null); else be.setCodPedido(Convert.ToInt32(newValue)); })         },
        { "NomeCliente", new Action<ProcessoVender, object>((ProcessoVender be, object newValue) => { if(newValue==null)be.setNomeCliente(null); else be.setNomeCliente((string) newValue ); })         },
        { "CodCliente", new Action<ProcessoVender, object>((ProcessoVender be, object newValue) => { if(newValue==null)be.setCodCliente(null); else be.setCodCliente(Convert.ToInt32(newValue)); })         },
        { "CodProduto", new Action<ProcessoVender, object>((ProcessoVender be, object newValue) => { if(newValue==null)be.setCodProduto(null); else be.setCodProduto(Convert.ToInt32(newValue)); })         },
        { "NomeProduto", new Action<ProcessoVender, object>((ProcessoVender be, object newValue) => { if(newValue==null)be.setNomeProduto(null); else be.setNomeProduto((string) newValue ); })         },
        { "QuantidadeProduto", new Action<ProcessoVender, object>((ProcessoVender be, object newValue) => { if(newValue==null)be.setQuantidadeProduto(null); else be.setQuantidadeProduto(Convert.ToInt32(newValue)); })         },
        { "ValorProduto", new Action<ProcessoVender, object>((ProcessoVender be, object newValue) => { if(newValue==null)be.setValorProduto(null); else be.setValorProduto(Convert.ToDecimal(newValue)); })         },
        { "ValorTotalPedido", new Action<ProcessoVender, object>((ProcessoVender be, object newValue) => { if(newValue==null)be.setValorTotalPedido(null); else be.setValorTotalPedido(Convert.ToDecimal(newValue)); })         },
        { "Idcliente", new Action<ProcessoVender, object>((ProcessoVender be, object newValue) => { if(newValue==null)be.setIdcliente(null); else be.setIdcliente((cliente) newValue ); })         }, 
    // FACTS 

    };

    static Dictionary<string, string> _factToParentAttribute = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)    {
    };
	public String getDisplayAttrib() {
		return null;
	}

	int? m_entityType = new int?(1);

	public override int? getEntityType()  {
		return m_entityType;
	}

	int? m_codPedido ;

	public int? getCodPedido() {
		return m_codPedido;
	}

	public void setCodPedido(int? paramcodPedido){
		this.m_codPedido = paramcodPedido;
	}

	string m_nomeCliente ;

	public string getNomeCliente() {
		return m_nomeCliente;
	}

	public void setNomeCliente(string paramnomeCliente){
		this.m_nomeCliente = paramnomeCliente;
	}

	int? m_codCliente ;

	public int? getCodCliente() {
		return m_codCliente;
	}

	public void setCodCliente(int? paramcodCliente){
		this.m_codCliente = paramcodCliente;
	}

	int? m_codProduto ;

	public int? getCodProduto() {
		return m_codProduto;
	}

	public void setCodProduto(int? paramcodProduto){
		this.m_codProduto = paramcodProduto;
	}

	string m_nomeProduto ;

	public string getNomeProduto() {
		return m_nomeProduto;
	}

	public void setNomeProduto(string paramnomeProduto){
		this.m_nomeProduto = paramnomeProduto;
	}

	int? m_quantidadeProduto ;

	public int? getQuantidadeProduto() {
		return m_quantidadeProduto;
	}

	public void setQuantidadeProduto(int? paramquantidadeProduto){
		this.m_quantidadeProduto = paramquantidadeProduto;
	}

	decimal? m_valorProduto ;

	public decimal? getValorProduto() {
		return m_valorProduto;
	}

	public void setValorProduto(decimal? paramvalorProduto){
		this.m_valorProduto = paramvalorProduto;
	}

	decimal? m_ValorTotalPedido ;

	public decimal? getValorTotalPedido() {
		return m_ValorTotalPedido;
	}

	public void setValorTotalPedido(decimal? paramValorTotalPedido){
		this.m_ValorTotalPedido = paramValorTotalPedido;
	}

	cliente m_idcliente ;

	public cliente getIdcliente() {
        if ((!this.isPersisting()) && (m_idcliente != null) && (m_idcliente.isLoaded() ) ) { 
            m_idcliente = (cliente)getPersistenceManager().find(m_idcliente.getClassName(), m_idcliente.getId());
        } else if ((!this.isPersisting()) && (m_idcliente != null)) { 
            m_idcliente = (cliente)ApplyScopeChangesToEntity(m_idcliente);
        }
		return m_idcliente;
	}

	public void setIdcliente(cliente paramidcliente){
		if (m_idcliente != null) {
			m_idcliente.setIdProcessoVender(null);
		}
		this.m_idcliente = paramidcliente;
		try { 
		    if ( (m_idcliente != null) && (m_idcliente.getIdProcessoVender() != null) && (m_idcliente.getIdProcessoVender().getId() != this.getId()) ) { 
			    m_idcliente.setIdProcessoVender(this);
		    }
		} catch (BABeanUtilsException e) { 
		}
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
		throw new Exception(string.Format("Error trying to set value for Attribute {0} in Entity {1}", propertyName, "ProcessoVender")); 
	}
	public override string GetFactOwnerEntityName(string factName) {
		if(gets.ContainsKey(factName))  
		   return "ProcessoVender";      
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

    ProcessoVender tg = (ProcessoVender) target; 
    cloneBaseValues(tg);
    tg.m_codPedido = this.m_codPedido; 
    tg.m_nomeCliente = this.m_nomeCliente; 
    tg.m_codCliente = this.m_codCliente; 
    tg.m_codProduto = this.m_codProduto; 
    tg.m_nomeProduto = this.m_nomeProduto; 
    tg.m_quantidadeProduto = this.m_quantidadeProduto; 
    tg.m_valorProduto = this.m_valorProduto; 
    tg.m_ValorTotalPedido = this.m_ValorTotalPedido; 
    tg.m_idcliente = (cliente)cloneRelation(this.m_idcliente); 

}

 
	}

}