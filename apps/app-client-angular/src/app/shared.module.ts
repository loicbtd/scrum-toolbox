import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmationService, MessageService, SharedModule as PrimengSharedModule } from 'primeng/api';
import { TerminalModule } from 'primeng/terminal';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { TooltipModule } from 'primeng/tooltip';
import { TabMenuModule } from 'primeng/tabmenu';
import { CardModule } from 'primeng/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { FileUploadModule } from 'primeng/fileupload';
import { HttpClientModule } from '@angular/common/http';
import { StepsModule } from 'primeng/steps';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectButtonModule } from 'primeng/selectbutton';
import { AccordionModule } from 'primeng/accordion';
import { SplitterModule } from 'primeng/splitter';
import { DialogModule } from 'primeng/dialog';
import { BlockUIModule } from 'primeng/blockui';
import { ChipsModule } from 'primeng/chips';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { PasswordModule } from 'primeng/password';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ProgressBarModule } from 'primeng/progressbar';
import { MessagesModule } from 'primeng/messages';
import { PanelModule } from 'primeng/panel';
import { RatingModule } from 'primeng/rating';
import { ToolbarModule } from 'primeng/toolbar';
import { InputNumberModule } from 'primeng/inputnumber';
import { BlockableDivModule, DurationPipeModule } from '@libraries/lib-angular';
import { InputSwitchModule } from 'primeng/inputswitch';
import { AppNavigationContainerModule } from '@libraries/lib-angular';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ColorPickerModule } from 'primeng/colorpicker';
import { CalendarModule } from 'primeng/calendar';
import { RippleModule } from 'primeng/ripple';
import { ChartModule } from 'primeng/chart';

const importedAndExportedModules = [
  CommonModule,
  FormsModule,
  MenubarModule,
  InputTextModule,
  PrimengSharedModule,
  TerminalModule,
  InputTextareaModule,
  ButtonModule,
  SidebarModule,
  TooltipModule,
  TabMenuModule,
  CardModule,
  ToastModule,
  FileUploadModule,
  HttpClientModule,
  StepsModule,
  TableModule,
  DropdownModule,
  SplitButtonModule,
  ScrollPanelModule,
  CheckboxModule,
  SelectButtonModule,
  AccordionModule,
  SplitterModule,
  DialogModule,
  BlockUIModule,
  ChipsModule,
  TagModule,
  ChipModule,
  PasswordModule,
  RadioButtonModule,
  ProgressSpinnerModule,
  ProgressBarModule,
  FormsModule,
  ReactiveFormsModule,
  MessagesModule,
  PanelModule,
  RatingModule,
  ToolbarModule,
  BlockableDivModule,
  InputNumberModule,
  DurationPipeModule,
  InputSwitchModule,
  AppNavigationContainerModule,
  ConfirmDialogModule,
  MultiSelectModule,
  AutoCompleteModule,
  ColorPickerModule,
  CalendarModule,
  RippleModule,
  ChartModule,
];

@NgModule({
  declarations: [],
  imports: [...importedAndExportedModules],
  exports: [...importedAndExportedModules],
  providers: [
    {
      provide: Window,
      useValue: window,
    },
    MessageService,
    ConfirmationService,
  ],
})
export class SharedModule {}
