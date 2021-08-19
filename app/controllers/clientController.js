import Client from '../schema/clientSchema';

export const addClient = async (req, res) => {
  const { firstName, lastName, contactNumber, email, address } = req.body;

  const client = new Client({
    firstName,
    lastName,
    contactNumber,
    email,
    address,
  });

  client.save((err, clientData) => {
    if (err) {
      throw err;
    } else {
      res.json(clientData);
    }
  });
};

export const getClients = async (req, res) => {
  const { id } = req.body;

  const client = await Client.findById(id);

  if (!client) {
    res.json({ msg: 'Client not found' });
  } else {
    res.json(client);
  }
};

export const editClient = async (req, res) => {
  const { id, firstName, lastName, contactNumber, email, address } = req.body;

  const client = await Client.findById(id);

  if (!client) {
    res.json({ msg: 'Client not found' });
  } else {
    Client.findOneAndUpdate(
      { _id: id },
      { firstName, lastName, contactNumber, email, address },
      (err, clientData) => {
        if (err) {
          throw err;
        } else {
          res.json(clientData);
        }
      }
    );
  }
};

export const deleteClient = async (req, res) => {
  const { id } = req.body;

  const client = await Client.findById(id);

  if (!client) {
    res.json({ msg: 'Client not found' });
  } else {
    Client.deleteOne({ _id: id }, (err, data) => {
      res.json(data);
    });
  }
};
