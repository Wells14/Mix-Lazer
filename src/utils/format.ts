const format = {
  currency: (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  },

  date: (date: Date | string): string => {
    const d = date instanceof Date ? date : new Date(date);
    return new Intl.DateTimeFormat('pt-BR').format(d);
  },

  shortId: (id: string): string => {
    return id.substring(0, 8);
  }
};

export { format };
