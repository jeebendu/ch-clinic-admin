package com.jee.clinichub.global.model;

import java.util.List;

public class DataTableResponse <T>{
  private int draw;
  private int recordsFiltered;
  private int recordsTotal;
  private List<T> data;
}
