package servico;
 

import javax.jms.Connection;
import javax.jms.Destination;
import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.MessageConsumer;
import javax.jms.MessageListener;
import javax.jms.Session;
import javax.jms.TextMessage;
import org.apache.activemq.ActiveMQConnectionFactory; 

public class Consumidor {
	public static void main(String[] args) {
		try {
			ActiveMQConnectionFactory connectionFactory = new ActiveMQConnectionFactory("tcp://localhost:61616");
			Connection connection = (Connection) connectionFactory.createConnection();
			connection.start();
			Session session = ((javax.jms.Connection) connection).createSession(false, Session.AUTO_ACKNOWLEDGE);
			Destination destination = session.createQueue("SPORT");
			
			MessageConsumer consumer = session.createConsumer(destination);
			consumer.setMessageListener(new MessageListener() {
				@Override
				public void onMessage(Message m) {
					try {
						System.out.println(((TextMessage) m).getText());
						//m.acknowledge(); //manda para plataforma que a menssagem foi lida
					} catch (JMSException e) {
						e.printStackTrace();
					}
				}
			});

			connection.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}